"use strict";

const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/.test(funcName); },
  multiArgs: true,
});


const user = {
    firstName: "John",
    lastName: "Doe",
    mailAdress: "john.doe@domain.com"
};

return Promise.try(() => {
    return request.postAsync({
        uri: "http://127.0.0.1:1200/user",
        json: true,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: user,
    }).then((result) => {
        return result[1];
        
    }).then((userCreated) => {

        const orderToCreate = {
            userId: userCreated._id,
            figuresQuantity: 7,
        };
        
        return request.postAsync({
            uri: "http://127.0.0.1:1200/order",
            json: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: orderToCreate,
        })
    }).then((result) => {
        console.log(result[1]);
        return result[1];
    });
})