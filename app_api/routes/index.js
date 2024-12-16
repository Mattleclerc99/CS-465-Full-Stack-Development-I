const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt'); // Updated import

const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'payload',
}).unless({ path: ['/api/login', '/api/register'] }); // Allow login/register

// Import the controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Define route for Login / Register endpoints
router
  .route('/login')
  .post(authController.login);

router
  .route('/register')
  .post(authController.register);

// Define route for our trips endpoint
router
  .route('/trips')
  .get(tripsController.tripsList) // GET method: retrieve trip list
  .post(auth, tripsController.tripsAddTrip); // POST method: add a trip

// GET method: retrieve a trip by code, PUT method: update a trip

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(auth, tripsController.tripsUpdateTrip)
  .delete(auth, tripsController.tripsDeleteTrip);


module.exports = router;
