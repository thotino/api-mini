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

return Promise.try(() => {
    return request.postAsync({
        uri: "http://127.0.0.1:1200/user",
        method: "POST",
        json: true,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: user,
    }).then((result) => {
        console.log(result[1]);
    })
})