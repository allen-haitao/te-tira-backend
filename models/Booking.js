const dynamodb = require('../config/db');

const Booking = {
  async create(booking) {
    const params = {
      TableName: 'Bookings',
      Item: booking,
    };
    return dynamodb.put(params).promise();
  },

  async getByUserId(userId) {
    const params = {
      TableName: 'Bookings',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };
    const result = await dynamodb.query(params).promise();
    return result.Items;
  },
};

module.exports = Booking;