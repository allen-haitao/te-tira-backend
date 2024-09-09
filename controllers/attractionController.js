
const Attraction = require('../models/Attraction');

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
exports.getAllAttractions = async (req, res) => {
  try {
    const attractions = await Attraction.getAll();
    res.send(attractions);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

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
 *       400:
 *         description: Some error happened
 */
exports.getAttractionsByHotel = async (req, res) => {
  try {
    const attractions = await Attraction.getByHotelId(req.params.hotelId);
    res.send(attractions);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

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
exports.searchAttractions = async (req, res) => {
  try {
    const { hotelId, maxDistance } = req.query;
    const attractions = await Attraction.search({ hotelId, maxDistance });
    res.send(attractions);
  } catch (err) {
    res.status(400).send(err.message);
  }
};