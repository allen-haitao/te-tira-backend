/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the hotel
 *         location:
 *           type: string
 *           description: The location of the hotel
 *     
*/

/**
 * @swagger
 * tags:
 *   name: Hotel
 *   description: The hotels managing API
 */

const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');


/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: get all hotels
 *     tags: [Hotel]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of hotels to fetch
 *       - in: query
 *         name: lastEvaluatedKey
 *         schema:
 *           type: string
 *           description: The key to start from (for pagination)
 *     responses:
 *       200:
 *         description: A list of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hotels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 lastEvaluatedKey:
 *                   type: string
 *                   description: The key to use for fetching the next set of results
 *       400:
 *         description: Some error happened
 */
router.get('/', hotelController.getAllHotels);
/**
 * @swagger
 * /hotel/search:
 *   post:
 *     summary: searh  hotels
 *     tags: [Hotel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: success
 *       400:
 *         description: Some error happened
 */
router.get('/search', hotelController.searchHotels); // Search endpoint
/**
 * @swagger
 * /hotel/{hotelid}:
 *   post:
 *     summary: get  hotel by id
 *     tags: [Hotel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: success
 *       400:
 *         description: Some error happened
 */
router.get('/:id', hotelController.getHotelById);

module.exports = router;