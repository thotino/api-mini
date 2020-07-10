"use strict";

const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/.test(funcName); },
  multiArgs: true,
});
const plugins = require("restify").plugins;
const models = require("udb-mini");
const utils = require("./util");
const producer = require("./producer-base");

const contactFactoryWithNewOrder = function contactFactoryWithNewOrder(orderData) {
    return Promise.try(() => {
        producer.sendMessagesToFactory(orderData);    
    });
};

exports.bodyParser = plugins.bodyParser({maxBodySize: 50000});

exports.createUser = function createUser(req, res, next) {
    return models.userModel.customCreation(req.body)
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.makeDefaultErrorHandler(next));
};

exports.createOrder = function createOrder(req, res, next) {
    return contactFactoryWithNewOrder(req.body)
        .then((factoryResults) => {
            return models.orderModel.customCreation(req.body);
        })
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.makeDefaultErrorHandler(next));
    // return models.orderModel.customCreation(req.body)
    //     .then((data) => {
    //         res.data = data;
    //         contactFactoryWithNewOrder(data);
    //         return next();
    //     }).catch(utils.makeDefaultErrorHandler(next));
};

exports.updateOrder = function updateOrder(req, res, next) {
    return models.orderModel.customUpdate(req.params.id, req.body)
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
