"use strict";

const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/.test(funcName); },
  multiArgs: true,
});


const user = {
    firstName: "Thotino",
    lastName: "GOBIN-GANSOU",
    mailAdress: "gthomario@yahoo.com"
};
/*
{
  _id: '5f05fc3b11806d3c663943bb',
  firstName: 'Thotino',
  lastName: 'GOBIN-GANSOU',
  mailAdress: 'gthomario@yahoo.com',
  registrationDate: '2020-07-08T17:02:51.952Z',
  createdAt: '2020-07-08T17:02:51.956Z',
  updatedAt: '2020-07-08T17:02:51.956Z',
  __v: 0
}
*/
const order = {
    userId: '5f05fc3b11806d3c663943bb',
    figuresQuantity: 7,
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
        // console.log(result[1]);
        return result[1];
        
    }).then((userCreated) => {
        const orderToCreate = {
            userId: userCreated._id,
            figuresQuantity: 7,
        };
        console.log(orderToCreate);
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