const dynamodb = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Favorite = {
    async add(userId, itemId, itemType) {
        const favoriteItem = {
            favoriteId: uuidv4(),
            userId,
            itemId,
            itemType,
            createdAt: new Date().toISOString(),
        };
        const params = {
            TableName: 'Favorites',
            Item: favoriteItem,
        };
        return dynamodb.put(params).promise();
    },

    async getByUserId(userId) {
        const params = {
            TableName: 'Favorites',
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

module.exports = Favorite;