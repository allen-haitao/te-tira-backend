const dynamodb = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Comment = {
    async create(userId, itemId, itemType, comment) {
        const commentItem = {
            commentId: uuidv4(),
            userId,
            itemId,
            itemType,
            comment,
            createdAt: new Date().toISOString(),
        };
        const params = {
            TableName: 'Comments',
            Item: commentItem,
        };
        return dynamodb.put(params).promise();
    },

    async getByItemId(itemId, itemType) {
        const params = {
            TableName: 'Comments',
            IndexName: 'ItemIdIndex',
            KeyConditionExpression: 'itemId = :itemId',
            FilterExpression: 'itemType = :itemType',

            ExpressionAttributeValues: {
                ':itemId': itemId,
                ':itemType': itemType,
            },
        };
        const result = await dynamodb.query(params).promise();
        return result.Items;
    },
};

module.exports = Comment;