"use strict";


const Promise = global.Promise = require("bluebird");
const mongoose = require("mongoose");

const utilRabbitmq = require("rabbitmq-utils");

const currentQueue = "orders-queue";
const productionQueue = "productionQueue";


exports.sendMessagesToFactory = function sendMessagesToFactory(message) {
    return Promise.try(() => {
        return utilRabbitmq.publishQueue(currentQueue, message);
    });
};

exports.sendMessagesToFactory = function sendMessagesToFactory(message) {
    return Promise.try(() => {
        const correlationId = (message._id) ? message._id.toString() : message.orderDate;

        return utilRabbitmq.publishQueue(currentQueue, message, {
            correlationId: correlationId,
            replyTo: productionQueue,
            persistent: false,
        });
    });
};

exports.receiveMessagesFromFactory = function receiveMessagesFromFactory() {
    return Promise.try(() => {
        return utilRabbitmq.consumeQueue(productionQueue);
    });
};
