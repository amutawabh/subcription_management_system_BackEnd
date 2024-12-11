//middleware/verifyToken.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing.' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token is missing.' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in the environment variables.');
            return res.status(500).json({ error: 'Internal server error.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token has expired.' });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token.' });
                }
                return res.status(401).json({ error: 'Token verification failed.' });
            }

            req.user = decoded; 
            next();
        });
    } catch (error) {
        console.error('Error in verifyToken middleware:', error.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = verifyToken;
