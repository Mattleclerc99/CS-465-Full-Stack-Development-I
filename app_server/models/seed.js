//Bring in the DB Connection
const mongoose = require('./db');
const Trip = require('./travlr');

//Read seed data from json file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

//Delete existing records
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

//Close the MongoDB connection & exit
seedDB().then(async () => {
    await mongoose.connection.close();
    process.exit(0);
});