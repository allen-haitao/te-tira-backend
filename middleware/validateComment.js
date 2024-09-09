const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Validation and sanitization middleware
exports.validateComment = [
    // Ensure the comment is not empty and within the max length (500 characters)
    check('comment').not().isEmpty().withMessage('Comment cannot be empty')
        .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),

    // Middleware to sanitize the input
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Sanitize the comment input
        req.body.comment = sanitizeHtml(req.body.comment, {
            allowedTags: [], // Disallow all HTML tags
            allowedAttributes: {} // Disallow attributes
        });

        next();
    }
];