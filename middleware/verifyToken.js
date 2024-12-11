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

     
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
}

module.exports = verifyToken;
