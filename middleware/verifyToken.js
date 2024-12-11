const jwt = require('jsonwebtoken');
const Log = require('../models/Logs'); 

async function logAction(action, user_id = null) {
    try {
        await Log.create({ action, user_id, timestamp: new Date() });
    } catch (err) {
        console.error('Failed to log action:', err.message);
    }
}

async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            await logAction('Authorization header is missing');
            return res.status(401).json({ error: 'Authorization header is missing.' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            await logAction('Token is missing');
            return res.status(401).json({ error: 'Token is missing.' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in the environment variables.');
            await logAction('JWT_SECRET is not defined');
            return res.status(500).json({ error: 'Internal server error.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                let logActionMessage = 'Token verification failed';
                if (err.name === 'TokenExpiredError') {
                    logActionMessage = 'Token has expired';
                } else if (err.name === 'JsonWebTokenError') {
                    logActionMessage = 'Invalid token';
                }

                await logAction(logActionMessage);
                return res.status(401).json({ error: logActionMessage });
            }

            req.user = decoded;

            await logAction('Token verified successfully', decoded.id || null);

            next();
        });
    } catch (error) {
        console.error('Error in verifyToken middleware:', error.message);
        await logAction('Error in verifyToken middleware');
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = verifyToken;
