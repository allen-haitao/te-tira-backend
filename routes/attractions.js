const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Attraction:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - distance
 *       properties:
 *         attractionId:
 *           type: string
 *           description: The ID of the attraction
 *         hotelId:
 *           type: string
 *           description: The ID of the hotel near the attraction
 *         name:
 *           type: string
 *           description: The name of the attraction
 *         description:
 *           type: string
 *           description: A brief description of the attraction
 *         distance:
 *           type: number
 *           description: The distance from the hotel to the attraction
 *         createdAt:
 *           type: string
 *           description: The date and time when the attraction was added
 *       example:
 *         attractionId: exampleAttractionId
 *         hotelId: exampleHotelId
 *         name: Example Attraction
 *         description: A beautiful attraction near the hotel
 *         distance: 5
 *         createdAt: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Attractions
 *   description: The attraction managing API
 */

/**
 * @swagger
 * /attractions:
 *   get:
 *     summary: Get all attractions
 *     tags: [Attractions]
 *     responses:
 *       200:
 *         description: A list of attractions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Some error happened
 */
router.get('/', attractionController.getAllAttractions);

/**
 * @swagger
 * /attractions/{hotelId}:
 *   get:
 *     summary: Get attractions by hotel ID
 *     tags: [Attractions]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hotel
 *     responses:
 *       200:
 *         description: A list of attractions near the hotel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       404:
 *         description: The hotel was not found
 *       400:
 *         description: Some error happened
 */
router.get('/:hotelId', attractionController.getAttractionsByHotel);

/**
 * @swagger
 * /attractions/search:
 *   get:
 *     summary: Search attractions
 *     tags: [Attractions]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: The ID of the hotel
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *         description: The maximum distance from the hotel
 *     responses:
 *       200:
 *         description: A list of attractions matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Some error happened
 */
router.get('/search', attractionController.searchAttractions);

module.exports = router;