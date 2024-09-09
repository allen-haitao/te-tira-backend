const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateComment } = require('../middleware/validateComment');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         itemId:
 *           type: string
 *           description: The id of the object commented
 *         itemType:
 *           type: string
 *           description: The type of the object commented
 *         comment:
 *           type: string
 *           description: The comment
 *     
*/

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The comments managing API
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment to a hotel or attraction
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
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
router.post('/', authMiddleware, validateComment, commentController.addComment);

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
router.get('/:itemType/:itemId', commentController.getCommentsByItemId);

module.exports = router;