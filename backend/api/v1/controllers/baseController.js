var sendDefaultResponse = function (res, err, data, dbConnection){

  dbConnection.release(); // release connection to the pool
  // console.log('Release connection threadId:', dbConnection.threadId);
  //console.log(data[0])

	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	} else {
    res.statusCode = 200;
    res.json(data);
  }

}

module.exports = { sendDefaultResponse };