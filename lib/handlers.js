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
    // return Promise.try(() => {
        return producer.sendMessagesToFactory(orderData);    
    // });
};

const getSerialNumbersForOrder = function getSerialNumbersForOrder() {
    return Promise.try(() => {
        return producer.receiveMessagesFromFactory();
    });    
};

exports.bodyParser = plugins.bodyParser({maxBodySize: 50000});

exports.getSerialNumbers = function getSerialNumbers(req, res, next) {
    return getSerialNumbers()
        .then((data) => { 
            res.data = data; 
            return next(); 
        })
        .catch(utils.errorHandler(next));
};

exports.createUser = function createUser(req, res, next) {
    return models.userModel.customCreation(req.body)
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.errorHandler(next));
};

exports.addDateToOrder = function addDateToOrder(req, res, next) {
    if(!req.body.orderDate) {
        req.body.orderDate = Date.now();
    }
    return next();
};

exports.createOrder = function createOrder(req, res, next) {
    return models.orderModel.customCreation(req.body)
        .then((data) => { 
            // console.log("ORDER : ", data);
            contactFactoryWithNewOrder(data);  
            return data; })
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.errorHandler(next));
};

exports.updateOrder = function updateOrder(req, res, next) {
    return models.orderModel.customUpdate(req.params.id, req.body)
        .then((data) => {
            res.data = data;
            return next();
        }).catch(utils.errorHandler(next));
};

exports.sendIntermediateData = function sendIntermediateData(req, res, next) {
    res.header("Connection", "keep-alive");
    res.status(200);
    res.json(res.data);
    return next();
};

exports.sendData = function sendData(req, res, next) {
    res.header("Connection", "close");
    res.status(200);
    res.json(res.data);
    return next();
};
