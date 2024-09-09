const Favorite = require('../models/Favorite');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       required:
 *         - itemId
 *         - itemType
 *       properties:
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
 * /favorites:
 *   post:
 *     summary: Add a hotel or attraction to favorites
 *     tags: [Favorites]
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
exports.addFavorite = async (req, res) => {
    try {
        // Get the userId from the auth middleware
        const userId = req.userId;

        // Extract itemId and itemType from the request body
        const { itemId, itemType } = req.body;

        // Add the item to the user's favorites
        await Favorite.add(userId, itemId, itemType);

        res.status(201).send('Item added to favorites successfully');
    } catch (err) {
        console.error('Error adding item to favorites:', err);
        res.status(400).send(err.message);
    }
};

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get favorites for a user
 *     tags: [Favorites]
 *     parameters:
 *         required: fasle
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
exports.getFavoritesByUserId = async (req, res) => {
    try {
        // Get the userId from the auth middleware
        const userId = req.userId;

        // Get the user's favorites from the database
        const favorites = await Favorite.getByUserId(userId);

        res.status(200).send(favorites);
    } catch (err) {
        console.error('Error fetching favorites:', err);
        res.status(400).send(err.message);
    }
};

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
exports.removeFavorite = async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        // Get the userId from the auth middleware
        const userId = req.userId;
        await Favorite.remove(userId, itemId, itemType);
        res.status(200).send('Item removed from favorites successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
};