"use strict";

const Promise = require("bluebird");
const { assert, expect } = require("chai");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/.test(funcName); },
  multiArgs: true,
});

const user = {
    firstName: "John",
    lastName: "Doe",
    mailAdress: "john.doe@domain.com"
};

const order = {
    figuresQuantity: 1,
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
        return result;
    });
};

const createOrder = function() {
    return request.postAsync({
        uri: "http://127.0.0.1:1200/order",
        json: true,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: order, 
    }).then((result) => {
        return result;
    });
};

describe("POST /user", function() {
    it("Should create a new user", function() {
        return createUser().then(([response, data]) => {
            expect(response.statusCode).to.equal(200);
            assert.isObject(data);
            assert.isNotEmpty(data);
            assert.hasAllKeys(data, ["_id", "firstName", "lastName", "mailAdress", "registrationDate", "createdAt", "updatedAt", "__v"]);
            assert.strictEqual(data.firstName, user.firstName);
            assert.strictEqual(data.lastName, user.lastName);
            assert.strictEqual(data.mailAdress, user.mailAdress);

        });
    });
});

describe("POST /order", function() {
    it("Should not create a new order", function() {
        return createOrder().then(([response, data]) => {
            expect(response.statusCode).to.equal(500);
            assert.isObject(data);
            assert.isNotEmpty(data);
            assert.hasAllKeys(data, ["code", "message"]);
            assert.strictEqual(data.code, "InternalServer");
            assert.strictEqual(data.message, "internal server error");
        });
    });
});