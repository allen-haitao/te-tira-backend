const dynamodb = require('../config/db');

const Attraction = {
  async search({ hotelId, maxDistance }) {
    const params = {
      TableName: 'Attractions',
      FilterExpression: '',
      ExpressionAttributeValues: {},
    };

    if (hotelId) {
      params.FilterExpression += 'hotelId = :hotelId';
      params.ExpressionAttributeValues[':hotelId'] = hotelId;
    }

    if (maxDistance) {
      if (params.FilterExpression) params.FilterExpression += ' AND ';
      params.FilterExpression += 'distance <= :maxDistance';
      params.ExpressionAttributeValues[':maxDistance'] = parseFloat(maxDistance);
    }

    const result = await dynamodb.scan(params).promise();
    return result.Items;
  },

  async getByHotelId(hotelId) {
    const params = {
      TableName: 'Attractions',
      IndexName: 'HotelIdIndex',
      KeyConditionExpression: 'hotelId = :hotelId',
      ExpressionAttributeValues: {
        ':hotelId': hotelId,
      },
    };
    const result = await dynamodb.query(params).promise();
    return result.Items;
  },
};

module.exports = Attraction;