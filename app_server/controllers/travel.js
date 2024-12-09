var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

/* GET travel view */
const travel = (req, res) => {
  res.render('travel', { title: 'Travlr Getaways', trips });
};

module.exports = {
  travel
};
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const mainPage = JSON.parse(fs.readFileSync('app_server/data/index.json', 'utf8'));

/* GET home page. */
const index = (req, res) => {
    pageTitle = packageJson.description + ' | Home';
    res.render('index', { activePage: 'main', title: pageTitle, mainPage });
};

module.exports = {
    index
};