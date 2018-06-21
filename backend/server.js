const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

//Config
const port = process.env.PORT || 3000;

//Init app
app = express();

//bodyParser
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));


//Routes
var routes = require('./api/v1/routes/resourceRoutes');
var routes = require('./api/v1/routes/proteindomainRoutes');

//Default
app.route('/')
.get((request, response) => {
	response.send('Default')
});


routes(app); //register the route
app.listen(port);

//log to console to let us know it's working
console.log('API server started on: ' + port);