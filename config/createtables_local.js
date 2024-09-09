const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();

const createUsersTable = () => {
    const params = {
        TableName: 'Users',
        KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'EmailIndex',
                KeySchema: [
                    { AttributeName: 'email', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ]
    };
    return dynamodb.createTable(params).promise();
};

const createHotelsTable = () => {
    const params = {
        TableName: 'Hotels',
        KeySchema: [
            { AttributeName: 'hotelId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'hotelId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
    return dynamodb.createTable(params).promise();
};

const createBookingsTable = () => {
    const params = {
        TableName: 'Bookings',
        KeySchema: [
            { AttributeName: 'bookingId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'bookingId', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'UserIdIndex',
                KeySchema: [
                    { AttributeName: 'userId', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ]
    };
    return dynamodb.createTable(params).promise();
};

const createAttractionsTable = () => {
    const params = {
        TableName: 'Attractions',
        KeySchema: [
            { AttributeName: 'attractionId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'attractionId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
    return dynamodb.createTable(params).promise();
};

const createCartsTable = () => {
    const params = {
        TableName: 'Carts',
        KeySchema: [
            { AttributeName: 'cartId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'cartId', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'UserIdIndex',
                KeySchema: [
                    { AttributeName: 'userId', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ]
    };
    return dynamodb.createTable(params).promise();
};

const createCommentsTable = () => {
    const params = {
        TableName: 'Comments',
        KeySchema: [
            { AttributeName: 'commentId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'commentId', AttributeType: 'S' },
            { AttributeName: 'itemId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'ItemIdIndex',
                KeySchema: [
                    { AttributeName: 'itemId', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ]
    };
    return dynamodb.createTable(params).promise();
};

const createFavoritesTable = () => {
    const params = {
        TableName: 'Favorites',
        KeySchema: [
            { AttributeName: 'favoriteId', KeyType: 'HASH' } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'favoriteId', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'UserIdIndex',
                KeySchema: [
                    { AttributeName: 'userId', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ]
    };
    return dynamodb.createTable(params).promise();
};

const createRoomsTable = () => {
    const params = {
        TableName: 'Rooms',
        KeySchema: [
            { AttributeName: 'roomTypeId', KeyType: 'HASH' }  // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'roomTypeId', AttributeType: 'S' },
            { AttributeName: 'hotelId', AttributeType: 'S' }, // Used for GSI
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'HotelIdIndex',
                KeySchema: [
                    { AttributeName: 'hotelId', KeyType: 'HASH' }  // Partition key for GSI
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
    return dynamodb.createTable(params).promise();
};
const createTables = async () => {
    try {
        await createUsersTable();
        await createHotelsTable();
        await createBookingsTable();
        await createAttractionsTable();
        await createCartsTable();
        await createCommentsTable();
        await createFavoritesTable();
        await createRoomsTable();
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

createTables();