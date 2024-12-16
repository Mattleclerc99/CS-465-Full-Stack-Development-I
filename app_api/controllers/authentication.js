// Import required modules
const passport = require('passport');
const mongoose = require('mongoose');

// Ensure the User model is registered
require('../models/user'); // Adjust the path to your User model
const User = mongoose.model('User');

// Register a new user
const register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);

    // Check if all required fields are provided
    if (!req.body.name || !req.body.email || !req.body.password) {
      console.log('Missing fields:', {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? 'Provided' : 'Missing',
      });
      return res.status(400).json({ message: "All fields required" });
    }

    // Create a new user instance
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    // Save the user to the database using async/await
    const savedUser = await user.save();

    // Generate JWT token upon successful registration
    const token = savedUser.generateJwt();
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Error during registration:', err); // Debugging error
    return res.status(400).json(err); // Return any validation or database errors
  }
};

// Login an existing user
const login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    // Check if both email and password are provided
    if (!req.body.email || !req.body.password) {
      console.log('Missing fields:', {
        email: req.body.email,
        password: req.body.password ? 'Provided' : 'Missing',
      });
      return res.status(400).json({ message: "All fields required" });
    }

    // Authenticate user using Passport's 'local' strategy
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        console.error('Error during authentication:', err); // Debug error
        return res.status(404).json(err); // Return error if any occurs during authentication
      }
      if (user) {
        console.log('User authenticated:', user); // Debug success
        // Generate JWT token upon successful authentication
        const token = user.generateJwt();
        return res.status(200).json({ token });
      } else {
        console.log('Authentication failed:', info); // Debug failure
        // Return the info message for authentication failure
        return res.status(401).json(info);
      }
    })(req, res);
  } catch (err) {
    console.error('Error during login:', err); // Debugging error
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the register and login functions
module.exports = {
  register,
  login,
};
