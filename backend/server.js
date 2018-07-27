const express = require('express');
//const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')


// Config
const port = process.env.PORT || 3000;

// Init app
app = express();

// An instance of router. A mini express application without all the bells and whistles of an express application
router = express.Router();

// middleware that can be used to enable CORS with various options
router.use(cors())

/*
Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers.
As req.body's shape is based on user-controlled input, 
all properties and values in this object are untrusted and should be validated before trusting
*/
router.use(bodyParser.json());

/*
he extended option allows to choose between parsing the 
URL-encoded data with the querystring library (when false) 
or the qs library (when true).
*/
router.use(bodyParser.urlencoded({ extended: false }));

app.route('/').get((req, res) => {
  res.statusCode = 418; // TODO
  res.send('Nothing to see here')
});

// Register the routes
routes = require('./api/v1/routes');
routes(router); 

// Apply the routes to our application
app.use('/api/v1/', router);

// START THE SERVER
app.listen(port);

//log to console to let us know it's working
console.log('API server started on: ' + port);