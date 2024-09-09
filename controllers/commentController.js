const Comment = require('../models/comment');
const he = require('he');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - itemId
 *         - itemType
 *         - comment
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user making the comment
 *         itemId:
 *           type: string
 *           description: The ID of the hotel or attraction being commented on
 *         itemType:
 *           type: string
 *           description: The type of the item (hotel or attraction)
 *         comment:
 *           type: string
 *           description: The content of the comment
 *       example:
 *         userId: exampleUserId
 *         itemId: exampleItemId
 *         itemType: hotel
 *         comment: This place was fantastic!
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment to a hotel or attraction
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Some error happened
 */
exports.addComment = async (req, res) => {
    try {
        const { itemId, itemType, comment } = req.body;
        // Get the userId from the auth middleware
        const userId = req.userId;
        await Comment.create(userId, itemId, itemType, comment);
        res.status(201).send('Comment added successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

/**
 * @swagger
 * /comments/{itemType}/{itemId}:
 *   get:
 *     summary: Get comments for a hotel or attraction
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemType
 *         schema:
 *           type: string
 *           enum: [hotel, attraction]
 *         required: true
 *         description: The type of the item (hotel or attraction)
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hotel or attraction
 *     responses:
 *       200:
 *         description: A list of comments for the hotel or attraction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Some error happened
 */
exports.getCommentsByItemId = async (req, res) => {
    try {
        const { itemId, itemType } = req.params;
        const comments = await Comment.getByItemId(itemId, itemType);
        // Encode comments to prevent XSS when rendering
        const encodedComments = comments.map(comment => {
            return {
                ...comment,
                content: he.encode(comment.content) // Encode the comment content
            };
        });
        res.send(encodedComments);
    } catch (err) {
        res.status(400).send(err.message);
    }
};