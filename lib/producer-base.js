"use strict";

const mongoose = require("mongoose");

const Promise = global.Promise = require("bluebird");
const amqp = Promise.promisifyAll( require("amqplib/callback_api") );
const currentQueue = "factoryQueue";
const productionQueue = "productionQueue";

const models = require("udb-mini");

// module.exports = class MessageQueueHandler {
//     constructor(connectionURL) {
//         this.connection = amqp.connectAsync(connectionURL);
//     }
//     createChannel() {
//         this.connection.createChannelAsync()
//             .then()
//     }
// };

exports.sendMessagesToFactory = function sendMessagesToFactory(message) {
    amqp.connect("amqp://localhost", function(error0, connection) {
    if(error0) { throw error0; }
    connection.createChannel(function(error1, channel) {
        if(error1) { throw error1; }

        channel.assertQueue(currentQueue, { durable: true });

        const correlationId = message._id.toString();
        
        channel.sendToQueue(currentQueue, Buffer.from(JSON.stringify(message)), {
            correlationId: correlationId,
            replyTo: productionQueue,
            persistent: true,
        });

        channel.consume(productionQueue, function(message) {
            models.orderModel.customUpdate(message.properties.correlationId, JSON.parse(message.content.toString()));

        }, { noAck: true, });
        console.log(" [x] Sent %s ", message);
    });
    setTimeout(() => {
        connection.close();
        // process.exit(0);
    }, 500);
});
};
