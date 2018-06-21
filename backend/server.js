const express = require('express');
const dotenv = require('dotenv');
const port = 3000;
app = express();

//Models
Resource = require('./api/models/resourceModel')

//Routes
var routes = require('./api/routes/resourceRoutes'); //importing route

//Default
app.route('/')
.get((request, response) => {
	response.send('Default')
});





routes(app); //register the route
app.listen(port);