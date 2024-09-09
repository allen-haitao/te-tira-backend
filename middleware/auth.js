const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Check if the Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).send('Authorization required');
        }

        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the userId to the req object
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Error in authMiddleware:', err);
        res.status(401).send('Invalid or expired token');
    }
};

module.exports = authMiddleware;