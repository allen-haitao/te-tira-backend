const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         itemId:
 *           type: string
 *           description: The ID of the hotel or attraction
 *         itemType:
 *           type: string
 *           description: The type of the item (hotel or attraction)
 *       example:
 *         userId: exampleUserId
 *         itemId: exampleItemId
 *         itemType: hotel
 */

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: The favorites managing API
 */

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a hotel or attraction to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       201:
 *         description: Item added to favorites successfully
 *       400:
 *         description: Some error happened
 */
router.post('/', authMiddleware, favoriteController.addFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get favorites for a user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: A list of favorite items for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Some error happened
 */
router.get('/', authMiddleware, favoriteController.getFavoritesByUserId);

/**
 * @swagger
 * /favorites:
 *   delete:
 *     summary: Remove a hotel or attraction from favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       200:
 *         description: Item removed from favorites successfully
 *       400:
 *         description: Some error happened
 */
router.delete('/', authMiddleware, favoriteController.removeFavorite);

module.exports = router;