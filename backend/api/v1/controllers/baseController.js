var sendDefaultResponse = function (res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}

module.exports = { sendDefaultResponse };