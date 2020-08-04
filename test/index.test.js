"use strict";

const Promise = require("bluebird");
const { assert } = require("chai");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/.test(funcName); },
  multiArgs: true,
});

const user = {
    firstName: "John",
    lastName: "Doe",
    mailAdress: "john.doe@domain.com"
};

const createUser = function() {
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
    });
};

describe("POST /user", function() {
    it("Should create a new user", function() {
        return createUser().then((data) => {
            assert.isObject(data);
            assert.isNotEmpty(data);
            assert.hasAllKeys(data, ["_id", "firstName", "lastName", "mailAdress", "registrationDate", "createdAt", "updatedAt", "__v"]);
            assert.strictEqual(data.firstName, user.firstName);
            assert.strictEqual(data.lastName, user.lastName);
            assert.strictEqual(data.mailAdress, user.mailAdress);

        });
    });
});