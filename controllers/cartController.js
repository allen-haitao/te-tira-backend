const Cart = require('../models/Cart');
const Room = require('../models/room');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - userId
 *         - itemKey 
 *         - roomTypeId
 *         - checkInDate
 *         - checkOutDate
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 **         itemKey:
 *           type: string
 *           description: The key of the cart item
 *         roomTypeId:
 *           type: string
 *           description: The ID of the room type to add to the cart
 *         checkInDate:
 *           type: string
 *           format: date
 *           description: The check-in date
 *         checkOutDate:
 *           type: string
 *           format: date
 *           description: The check-out date
 *       example:
 *         itemKey: exampleItemKey
 *         roomTypeId: exampleRoomTypeId
 *         checkInDate: 2024-07-01
 *         checkOutDate: 2024-07-05
 * 
 *     Checkout:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *       example:
 *         userId: exampleUserId
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart for a user
 *     tags: [Cart]
 *     parameters:
 *         required: false
 *     responses:
 *       200:
 *         description: A cart for the user
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Some error happened
 */
exports.getCartByUserId = async (req, res) => {
    try {
        const userId = req.userId;

        const cart = await Cart.getByUserId(userId);

        res.status(200).send(cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(400).send(err.message);
    }
};

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a room type to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Some error happened
 */
exports.addItem = async (req, res) => {
    try {
        const { roomTypeId, checkInDate, checkOutDate } = req.body;
        const userId = req.userId;

        const room = await Room.getById(roomTypeId);
        if (!room) {
            return res.status(404).send('Room type not found');
        }

        await Cart.addItem(userId, room, checkInDate, checkOutDate);
        res.send('Item added to cart');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove a room type from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveCartItem'
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Some error happened
 */
exports.removeItem = async (req, res) => {
    try {
        const { itemKey } = req.body;
        const userId = req.userId;

        await Cart.removeItem(userId, itemKey);
        res.send('Item removed from cart');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Checkout'
 *     responses:
 *       200:
 *         description: Checkout successful
 *       400:
 *         description: Some error happened
 */
exports.checkout = async (req, res) => {
    try {
        const userId = req.userId;
        await Cart.checkout(userId);
        logger.info('user checkout:', { userId });
        res.send('Checkout successful');
    } catch (err) {
        logger.error('Checkout error: ${err.message}', { userId })
        res.status(400).send(err.message);
    }
};