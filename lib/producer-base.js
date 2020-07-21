"use strict";

const mongoose = require("mongoose");

const Promise = global.Promise = require("bluebird");
const amqp = Promise.promisifyAll( require("amqplib/callback_api") );

const utilRabbitmq = require("rabbitmq-utils");
const models = require("udb-mini");

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
// exports.sendMessagesToFactory = function sendMessagesToFactory(message) {
//     amqp.connect("amqp://localhost", function(error0, connection) {
//     if(error0) { throw error0; }
//     connection.createChannel(function(error1, channel) {
//         if(error1) { throw error1; }

//         channel.assertQueue(currentQueue, { durable: true });

//         const correlationId = message._id.toString();
//         console.log("Sending message to queue : ", currentQueue);
//         // console.log(message);
//         channel.sendToQueue(currentQueue, Buffer.from(JSON.stringify(message)), {
//             correlationId: correlationId,
//             replyTo: productionQueue,
//             persistent: true,
//         });        
//         console.log(" [x] Sent %s ", message);
//     });
//     setTimeout(() => {
//         connection.close();
//         // process.exit(0);
//     }, 500);
// });
// };

// exports.receiveMessagesFromFactory = function receiveMessagesFromFactory() {
//     amqp.connect("amqp://localhost", function(error0, connection) {
//     if(error0) { throw error0; }
//     connection.createChannel(function(error1, channel) {
//         if(error1) { throw error1; }
//         channel.assertQueue(productionQueue, { durable: true });

//         console.log("Receiving message from queue : ", productionQueue);
//         channel.consume(productionQueue, function(message) {
//             console.log(message);

//             return models.orderModel.customUpdate(message.properties.correlationId, JSON.parse(message.content.toString()));

//         }, { noAck: true, });
//     });
//     setTimeout(() => {
//         connection.close();
//         // process.exit(0);
//     }, 500);
// });
// };