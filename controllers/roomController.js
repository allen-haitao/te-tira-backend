const Room = require('../models/Room');

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
 *     summary: Create a new room type
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
exports.createRoom = async (req, res) => {
    try {
        const { hotelId, roomTypeName, price, total, available } = req.body;

        // Validate inputs
        if (!hotelId || !roomTypeName || price === undefined || total === undefined || available === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create the room
        const room = await Room.create(hotelId, roomTypeName, price, total, available);
        res.status(201).json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /rooms/{roomTypeId}/availability:
 *   patch:
 *     summary: Update room availability
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
exports.updateRoomAvailability = async (req, res) => {
    try {
        const { roomTypeId } = req.params;
        const { available } = req.body;

        if (available === undefined) {
            return res.status(400).json({ error: 'Available count is required' });
        }

        // Update the room availability
        const updatedRoom = await Room.updateAvailability(roomTypeId, available);
        res.status(200).json(updatedRoom);
    } catch (error) {
        console.error('Error updating room availability:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /rooms/hotel:
 *   get:
 *     summary: Get all room types for a specific hotel
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
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
exports.getRoomsByHotelId = async (req, res) => {
    try {
        const hotelId = req.query.hotelId;
        console.log("get room by hotel", hotelId)

        // Fetch rooms by hotelId
        const rooms = await Room.getByHotelId(hotelId);
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: error.message });
    }
};

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
exports.getRoomById = async (req, res) => {
    try {
        const { roomTypeId } = req.params;

        // Fetch the room by roomTypeId
        const room = await Room.getById(roomTypeId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: error.message });
    }
};