const dynamodb = require('../config/db');


const Hotel = {
  async search({ location, minPrice, maxPrice }) {
    const params = {
      TableName: 'Hotels',
      FilterExpression: '',
      ExpressionAttributeValues: {},
    };

    if (location) {
      params.FilterExpression += 'contains(#loc, :location)';
      params.ExpressionAttributeValues[':location'] = location;
      params.ExpressionAttributeNames = { '#loc': 'location' };
    }

    if (minPrice) {
      if (params.FilterExpression) params.FilterExpression += ' AND ';
      params.FilterExpression += 'pricePerNight >= :minPrice';
      params.ExpressionAttributeValues[':minPrice'] = parseFloat(minPrice);
    }

    if (maxPrice) {
      if (params.FilterExpression) params.FilterExpression += ' AND ';
      params.FilterExpression += 'pricePerNight <= :maxPrice';
      params.ExpressionAttributeValues[':maxPrice'] = parseFloat(maxPrice);
    }

    const result = await dynamodb.scan(params).promise();
    return result.Items;
  },

  async getAll(limit, lastEvaluatedKey) {
    const params = {
      TableName: 'Hotels',
      Limit: limit,
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = { hotelId: lastEvaluatedKey.hotelId };
    }

    const result = await dynamodb.scan(params).promise();
    return {
      hotels: result.Items,
      lastEvaluatedKey: result.LastEvaluatedKey, // Use this key to fetch the next set of results
    };
  },

  async getById(hotelId) {
    const params = {
      TableName: 'Hotels',
      Key: { hotelId },
    };
    const result = await dynamodb.get(params).promise();
    return result.Item;
  },
};

module.exports = Hotel;