var ProteinDomain = require('../models/proteindomainModel');
var BaseController = require('./baseController');


exports.getProteinDomainByAcc = function (req, res, next) {
  if (req.params.acc &&  req.params.version) {
    ProteinDomain.getByAcc(req.params.acc, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  } else {
    ProteinDomain.getAll(function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};

exports.getProteinDomainWithDistributionByAcc = function (req, res, next) {
  if (req.params.acc && req.params.version) {
    ProteinDomain.getProteinDomainWithDistributionByAcc(req.params.acc, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};

exports.getDataByResourceType = function (req, res, next) {
  if (req.params.type && req.params.version) {
    ProteinDomain.getDataByResourceType(req.params.type, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};

exports.getDataWithDistributionByResourceType = function (req, res, next) {
  if (req.params.type && req.params.version) {
    ProteinDomain.getDataWithDistributionByResourceType(req.params.type, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};


