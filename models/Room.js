const dynamodb = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Room = {
    async create(hotelId, roomTypeName, price, total, available) {
        const roomTypeId = uuidv4();  // Generate a unique ID for the room type

        const room = {
            roomTypeId,
            hotelId,
            roomTypeName,
            price,
            total,
            available,
            createdAt: new Date().toISOString(),
        };

        const params = {
            TableName: 'Rooms',
            Item: room,
        };

        await dynamodb.put(params).promise();
        return room;
    },

    async updateAvailability(roomTypeId, available) {
        const params = {
            TableName: 'Rooms',
            Key: { roomTypeId },
            UpdateExpression: 'set available = :available',
            ExpressionAttributeValues: {
                ':available': available,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    },

    async getByHotelId(hotelId) {
        const params = {
            TableName: 'Rooms',
            IndexName: 'HotelIdIndex',  // Assuming you create a GSI on hotelId
            KeyConditionExpression: 'hotelId = :hotelId',
            ExpressionAttributeValues: {
                ':hotelId': hotelId,
            },
        };

        const result = await dynamodb.query(params).promise();
        return result.Items;
    },

    async getById(roomTypeId) {
        const params = {
            TableName: 'Rooms',
            Key: { roomTypeId },
        };

        const result = await dynamodb.get(params).promise();
        return result.Item;
    },
};

module.exports = Room;