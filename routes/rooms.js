const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - hotelId
 *         - roomTypeName
 *         - price
 *         - total
 *         - available
 *       properties:
 *         roomTypeId:
 *           type: string
 *           description: The auto-generated ID of the room type
 *         hotelId:
 *           type: string
 *           description: The ID of the hotel this room belongs to
 *         roomTypeName:
 *           type: string
 *           description: The name of the room type (e.g., "Deluxe", "Suite")
 *         price:
 *           type: number
 *           description: Price per night for this room type
 *         total:
 *           type: integer
 *           description: Total number of rooms available of this type
 *         available:
 *           type: integer
 *           description: Number of rooms currently available
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of this room type
 *       example:
 *         roomTypeId: d5fE_asz
 *         hotelId: 123e4567-e89b-12d3-a456-426614174000
 *         roomTypeName: Deluxe
 *         price: 120
 *         total: 10
 *         available: 8
 *         createdAt: 2021-06-29T14:48:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API for managing rooms in hotels
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room type, it is a admin API
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: The room type was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/rooms', roomController.createRoom);

/**
 * @swagger
 * /rooms/{roomTypeId}/availability:
 *   patch:
 *     summary: Update room availability, it is a admin API
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomTypeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: integer
 *                 description: The number of available rooms to set
 *     responses:
 *       200:
 *         description: The room availability was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Server error
 */
router.patch('/rooms/:roomTypeId/availability', roomController.updateRoomAvailability);

/**
 * @swagger
 * /rooms/hotel:
 *   get:
 *     summary: Get all room types for a specific hotel
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hotel to retrieve rooms for
 *     responses:
 *       200:
 *         description: A list of room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Server error
 */
router.get('/hotel', roomController.getRoomsByHotelId);

/**
 * @swagger
 * /rooms/{roomTypeId}:
 *   get:
 *     summary: Get a room type by its ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomTypeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room type to retrieve
 *     responses:
 *       200:
 *         description: The room type information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Server error
 */
router.get('/rooms/:roomTypeId', roomController.getRoomById);

module.exports = router;