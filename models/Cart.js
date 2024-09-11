const dynamodb = require('../config/db');
const Booking = require('./booking')
const { v4: uuidv4 } = require('uuid');
const { Decimal } = require('decimal.js');

const Cart = {
  async create(userId) {
    const cart = {
      cartId: uuidv4(),
      userId,
      items: [],
      totalPrice: 0,
      createdAt: new Date().toISOString(),
    };
    const params = {
      TableName: 'Carts',
      Item: cart,
    };
    return dynamodb.put(params).promise();
  },

  async getByUserId(userId) {
    const params = {
      TableName: 'Carts',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };
    const result = await dynamodb.query(params).promise();
    return result.Items[0];
  },

  async addItem(userId, room, checkInDate, checkOutDate) {
    let cart = await this.getByUserId(userId);
    if (!cart) {
      cart = await this.create(userId);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = new Decimal((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights <= 0) {
      throw new Error('Invalid check-in or check-out date');
    }

    const pricePerNight = new Decimal(room.price);  // Ensure pricePerNight is a Decimal
    if (pricePerNight.isNaN()) {
      throw new Error('Invalid price per night');
    }

    const cartItem = {
      roomTypeId: room.roomTypeId,
      itemKey: uuidv4(),
      roomTypeName: room.roomTypeName,
      hotelId: room.hotelId,
      hotelName: room.hotelName,
      pricePerNight: pricePerNight.toNumber(),
      checkInDate,
      checkOutDate,
      nights: nights.toNumber(),
      totalPrice: pricePerNight.mul(nights).toNumber(),
    };

    cart.items = cart.items || [];
    cart.items.push(cartItem);
    cart.totalPrice += cartItem.totalPrice;

    const params = {
      TableName: 'Carts',
      Item: cart,
    };
    return dynamodb.put(params).promise();
  },

  async removeItem(userId, itemKey) {
    const cart = await this.getByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item.itemKey === itemKey);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    const item = cart.items[itemIndex];
    cart.totalPrice -= item.totalPrice;
    cart.items.splice(itemIndex, 1);

    const params = {
      TableName: 'Carts',
      Item: cart,
    };
    return dynamodb.put(params).promise();
  },

  async clearCart(cartId) {
    const params = {
      TableName: 'Carts',
      Key: {
        cartId: cartId
      }
    };
    return dynamodb.delete(params).promise();
  },

  async checkout(userId) {
    const cart = await this.getByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart not found or is empty');
    }

    const bookingPromises = cart.items.map(async (item) => {
      const bookingId = uuidv4();

      const booking = {
        bookingId,
        userId,
        hotelId: item.hotelId,
        hotelName: item.hotelName,
        roomTypeId: item.roomTypeId,
        roomTypeName: item.roomTypeName,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        nights: item.nights,
        totalPrice: item.totalPrice,
        bookingStatus: 'Confirmed',
      };

      return Booking.create(booking);
      //It should update the available number of the room, an it should consider the date.
    });

    await Promise.all(bookingPromises);

    await this.clearCart(cart.cartId);
  }
};

module.exports = Cart;