"use strict";

const Promise = global.Promise = require("bluebird");
const amqp = Promise.promisifyAll( require("amqplib/callback_api") );
const currentQueue = "factoryQueue";

// module.exports = class Producer {
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

        channel.sendToQueue(currentQueue, Buffer.from(message), {
            persistent: true,
        });
        console.log(" [x] Sent %s ", message);
    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
};
