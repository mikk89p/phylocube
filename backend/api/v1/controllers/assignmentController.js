var Assignment = require('../models/assignmentModel');
var BaseController = require('./baseController');



exports.getAssignmentByAcc = function (req, res, next) {
  if (req.params.acc && req.params.type &&  req.params.version) {
    Assignment.getByAcc(req.params.acc,req.params.type, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  } else {
    Assignment.getAll(function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};

exports.getDataWithDistributionByResourceTypeAndTaxonomyId = function (req, res, next) {
  if (req.params.type && req.params.id && req.params.version) {
    Assignment.getDataWithDistributionByResourceTypeAndTaxonomyId(req.params.type, req.params.id, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};

exports.getDataByResourceTypeAndTaxonomyId = function (req, res, next) {
  if (req.params.type && req.params.id && req.params.version) {
    Assignment.getDataByResourceTypeAndTaxonomyId(req.params.type, req.params.id, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};

exports.getAccByResourceTypeAndTaxonomyId = function (req, res, next) {
  if (req.params.type && req.params.id && req.params.version) {
    Assignment.getAccByResourceTypeAndTaxonomyId(req.params.type, req.params.id, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};