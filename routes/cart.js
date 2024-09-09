const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

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
 *           description: The ID of the user, not required, the backend get it in token.
 *         itemKey:
 *           type: string
 *           description: The key of the cart item, backend generated, only require on remove API
 *         roomTypeId:
 *           type: string
 *           description: The ID of the room type to add to the cart
 *         roomTypeName:
 *           type: string
 *           description: The name of the room type
 *         hotelId:
 *           type: string
 *           description: The ID of the hotel associated with the room
 *         hotelName:
 *           type: string
 *           description: The name of the hotel associated with the room
 *         pricePerNight:
 *           type: number
 *           description: The price per night for this room type
 *         checkInDate:
 *           type: string
 *           format: date
 *           description: The check-in date
 *         checkOutDate:
 *           type: string
 *           format: date
 *           description: The check-out date
 *         nights:
 *           type: integer
 *           description: The number of nights for the booking
 *         totalPrice:
 *           type: number
 *           description: The total price for this booking
 *       example:
 *         userId: exampleUserId
 *         itemKey: exampleItemKey
 *         roomTypeId: exampleRoomTypeId
 *         roomTypeName: Deluxe
 *         hotelId: exampleHotelId
 *         hotelName: Example Hotel
 *         pricePerNight: 120
 *         checkInDate: 2024-07-01
 *         checkOutDate: 2024-07-05
 *         nights: 4
 *         totalPrice: 480
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
 * tags:
 *   name: Cart
 *   description: The cart managing API
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart for a user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: A cart for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Some error happened
 */
router.get('/', authMiddleware, cartController.getCartByUserId);


/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a hotel to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
router.post('/add', authMiddleware, cartController.addItem);

/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove a hotel from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
router.post('/remove', authMiddleware, cartController.removeItem);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
router.post('/checkout', authMiddleware, cartController.checkout);

module.exports = router;