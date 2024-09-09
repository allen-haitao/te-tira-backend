const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const PasswordValidator = require('password-validator');
const logger = require('../utils/logger');

// Lockout settings
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes

// Create a schema for password validation
const passwordSchema = new PasswordValidator();

// password rules
passwordSchema
  .is().min(8)                                      // Minimum length 8
  .is().max(100)                                    // Maximum length 100
  .has().uppercase()                                // Must have uppercase letters
  .has().lowercase()                                // Must have lowercase letters
  .has().digits(2)                                  // Must have at least 2 digits
  .has().not().spaces()                             // Should not have spaces
  .is().not().oneOf(['Password123', 'Password']);   // Blacklist common passwords


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully registered
 *       400:
 *         description: Some error happened
 */
exports.register = async (req, res) => {
  try {
    const { password } = req.body;
    // Validate the password
    const isPasswordValid = passwordSchema.validate(password);

    if (!isPasswordValid) {
      logger.warn('Password validation failed', { email: req.body.email });
      return res.status(400).json({ error: 'Password does not meet the security requirements.' });
    }

    const user = await User.create(req.body);
    logger.info(`User registered successfully: ${req.body.email}`);
    res.status(201).send('User registered successfully');
  } catch (err) {
    logger.error(`Error during registration: ${err.message}`, { email: req.body.email });
    res.status(400).send(err.message);
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Some error happened
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Login attempt failed due to validation errors', { email: req.body.email });
      return res.status(400).json({ errors: errors.array() });
    }
    // Validate request
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    // Get user by email
    const user = await User.getByEmail(email);
    if (!user) {
      logger.error(`Failed login attempt: Invalid email - ${email}`);
      return res.status(401).send('Invalid email or password');
    }

    // Check if the account is locked
    if (user.accountLocked && user.lockUntil > Date.now()) {
      logger.error(`Account locked: ${email}`);
      return res.status(403).send('Account is locked. Try again later.');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      // Check if account should be locked
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.accountLocked = true;
        user.lockUntil = new Date(Date.now() + LOCK_DURATION);
        await User.update(user); // Save changes to the user
        logger.error(`Account locked after failed attempts: ${email}`);
        return res.status(403).send('Account is locked due to too many failed login attempts');
      }
      await User.update(user); // Save the updated failed attempts count
      logger.error(`Failed login attempt: Incorrect password for email - ${email}`);

      return res.status(401).send('Invalid email or password');
    }

    // Reset failed attempts after successful login
    user.failedLoginAttempts = 0;
    user.accountLocked = false;
    user.lockUntil = null;
    await User.update(user); // Save changes to the user

    // Sign the token with an expiration time (e.g., 1 hour)
    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Set token expiration time
    );

    // Log successful login
    logger.info(`Successful login: ${email}`);

    // Send the token to the client
    res.status(200).json({ token, email: email });
  } catch (err) {
    logger.error(`Error during login for ${req.body.email}: ${err.message}`);
    res.status(500).send('Internal server error');
  }
};

// Middleware for input validation
exports.validateLogin = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').not().isEmpty().withMessage('Password is required'),
];