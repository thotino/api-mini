/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author author name
 * @requires dependency 1
 * @requires dependency 2
 * ...
 */

"use strict";

//================================================================================
// dependencies
//================================================================================
const restify = require("restify");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dataHandlers = require("./lib/handlers");
const utils = require("./lib/util");
//================================================================================
// config
//================================================================================
/** import here configurations */

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
const devDBURL = "mongodb://127.0.0.1:27017/mini-DB"
const mongoDBURL = process.env.MONGODB_URI || devDBURL;
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const server = restify.createServer({});

server.post("/user", [
    utils.validateHeaderContentJson,
    utils.validateHeaderAcceptJson,
    dataHandlers.bodyParser,
    utils.validateBodyJson,
    dataHandlers.createUser,
    dataHandlers.sendData,
]);

server.post("/order", [
    utils.validateHeaderContentJson,
    utils.validateHeaderAcceptJson,
    dataHandlers.bodyParser,
    utils.validateBodyJson,
    dataHandlers.createOrder,
    dataHandlers.sendData,
]);

server.listen(1200, console.log("listening to the port 1200..."));
