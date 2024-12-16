const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const User = require('../models/user')
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode}) // No filter, return all records
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

const getUser = async (req, res) => {
  try {
    if (req.auth && req.auth.email) {
      const user = await User.findOne({ email: req.auth.email }).exec();

      if (!user) {
        console.error('User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('User found:', user.name);
      return user.name; 
    } else {
      console.error('No user authentication found');
      return res.status(401).json({ message: 'Unauthorized: No auth email' });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};





const tripsAddTrip = async (req, res) => {
  try {
    // Validate user
    await getUser(req, res);

    // Create a new trip
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    });

    // Respond with the created trip
    return res.status(201).json(trip); // 201: Created
  } catch (err) {
    // Handle errors and respond accordingly
    return res.status(400).json(err); // 400: Bad Request
  }
};


// PUT: /trips/:tripCode - Updates an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
  try {
    // Retrieve the user
    const userName = await getUser(req, res);
    if (!userName) return; // If user validation fails, stop execution

    console.log('Updating trip for user:', userName);

    // Find and update the trip
    const trip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode }, // Query by trip code
      {
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
      },
      { new: true } // Return updated document
    );

    if (!trip) {
      return res.status(404).json({ message: `Trip not found with code ${req.params.tripCode}` });
    }

    console.log('Trip updated successfully:', trip);
    return res.status(200).json(trip); // Return updated trip
  } catch (err) {
    console.error('Error updating trip:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const tripsDeleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ code: req.params.tripCode });
    
    if (!trip) {
      return res.status(404).json({ message: `Trip not found with code ${req.params.tripCode}` });
    }

    return res.status(200).json({ message: `Trip with code ${req.params.tripCode} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting trip:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err });
  }
};




module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    getUser
};