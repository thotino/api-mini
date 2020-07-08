"use strict";

const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/.test(funcName); },
  multiArgs: true,
});
const plugins = require("restify").plugins;
const models = require("udb-mini");
const utils = require("./util");

exports.bodyParser = plugins.bodyParser({maxBodySize: 50000});

exports.createUser = function createUser(req, res, next) {
    return models.userModel.create(req.body)
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.makeDefaultErrorHandler(next));
};

exports.createOrder = function createOrder(req, res, next) {
    return models.orderModel.create(req.body)
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.makeDefaultErrorHandler(next));
};

exports.sendData = function sendData(req, res, next) {
    res.header("Connection", "close");
    res.status(200);
    res.json(res.data);
    return next();
  };