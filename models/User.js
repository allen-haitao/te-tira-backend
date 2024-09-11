const dynamodb = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


const User = {
  async create(user) {
    user.userId = uuidv4()
    user.password = await bcrypt.hash(user.password, 10);
    user.failedLoginAttempts = 0; // Initialize failed login attempts
    user.accountLocked = false; // Initialize account locked status
    user.lockUntil = null; // Initialize lock time
    const params = {
      TableName: 'Users',
      Item: user,
    };
    console.log(JSON.stringify(user, null, "\t"))
    return dynamodb.put(params).promise();
  },

  async getByEmail(email) {
    const params = {
      TableName: 'Users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };
    const result = await dynamodb.query(params).promise();
    return result.Items[0];
  },

  async update(user) {
    const params = {
      TableName: 'Users',
      Key: { userId: user.userId },
      UpdateExpression: 'set failedLoginAttempts = :fail, accountLocked = :lock, lockUntil = :lockUntil',
      ExpressionAttributeValues: {
        ':fail': user.failedLoginAttempts,
        ':lock': user.accountLocked,
        ':lockUntil': user.lockUntil,
      },
    };
    return dynamodb.update(params).promise();
  },
};

module.exports = User;