var express = require('express');
var app = express();
var expressRouter = express.Router();
var expressController = require('../controller/gateController.js')();

expressRouter.route('/')
	.post(expressController.post);
module.exports = expressRouter;	