var Clan = require('../models/clanModel');
var BaseController = require('./baseController');


exports.getClanByPfamAcc = function (req, res) {
  if (req.params.pfam && req.params.version) {
    Clan.getClanByPfamAcc(req.params.pfam, req.params.version, function (err, rows, dbConnection) {
      BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });
  }
};