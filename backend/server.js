const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')


// Config
const port = process.env.PORT || 3000;

// Init app
app = express();

// middleware that can be used to enable CORS with various options
app.use(cors())

/*
Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers.
As req.body's shape is based on user-controlled input, all properties and values in this object are untrusted and should be validated before trusting
*/
app.use(bodyParser.json());

/*
he extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) 
or the qs library (when true).
*/
app.use(bodyParser.urlencoded({ extended: false }));


//Routes
var routes = require('./api/v1/routes');


//Default
app.route('/')
.get((req, res) => {
	res.statusCode = 200;
	res.send('Nothing to see here')
});


routes(app); //register the route
app.listen(port);

//log to console to let us know it's working
console.log('API server started on: ' + port);