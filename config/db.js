const AWS = require('aws-sdk');

AWS.config.update({
  //region: process.env.AWS_REGION,
  endpoint: 'http://localhost:8000' // Local DynamoDB endpoint
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamodb;