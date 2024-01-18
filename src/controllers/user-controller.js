const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'e00c92f3539e0d6d4f5a09bc0b69646396a0df50a26cb30514fb47db350cf054g';

/**
 * User registration handler
 * 
 * This function handles the registration of a new user.
 * It checks if the user already exists, generates a salt and hashes the password,
 * creates a new user object, and saves it to the database.
 * 
 * @param {Object} req - The request object containing user data in the request body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} - The response JSON object with a success message or an error message.
 */
 exports.register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('An error occurred during user registration:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
};

/**
 * User login handler
 * 
 * This function handles the login of a user.
 * It checks if the user exists, compares the provided password with the stored password,
 * generates a JWT token if the credentials are valid, and sends the token back to the client.
 * 
 * @param {Object} req - The request object containing user credentials in the request body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} - The response JSON object with a JWT token or an error message.
 */
 exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('An error occurred during user login:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
};

/**
 * User profile retrieval handler
 * 
 * This function handles the retrieval of a user's profile.
 * It finds the user by their ID and sends the user object back to the client.
 * 
 * @param {Object} req - The request object containing the user's ID.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} - The response JSON object with the user's profile or an error message.
 */
 exports.getProfile = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('An error occurred during user profile retrieval:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
};

/**
 * User profile update handler
 * 
 * This function handles the update of a user's profile.
 * It finds the user by their ID, updates the username and email,
 * and saves the updated user to the database.
 * 
 * @param {Object} req - The request object containing the user's ID and updated profile data.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} - The response JSON object with a success message or an error message.
 */
 exports.updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user's username and email
      user.username = username;
      user.email = email;
  
      // Save the updated user to the database
      await user.save();
  
      res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      console.error('An error occurred during user profile update:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
};