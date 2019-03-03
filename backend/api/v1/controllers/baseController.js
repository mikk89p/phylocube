var helper = require('../models/helperModel');


var sendDefaultResponse = function (res, err, data, dbConnection){


	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	} else {
    res.statusCode = 200;
    res.json(data);
  }
  //console.log('Release connection threadId:', dbConnection.threadId, helper.getDateTime());
  dbConnection.release(); // release connection to the pool
  // console.log('Release connection threadId:', dbConnection.threadId);
  //console.log(data[0])



}

module.exports = { sendDefaultResponse };