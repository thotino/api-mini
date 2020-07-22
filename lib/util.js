const errors = require("restify-errors");
const fs = require("fs-extra");
const lodash = require("lodash");

exports.utilConfPromise = fs.readJson("./conf/settings.json");

exports.logRequestBody = function logRequestBody(req, res, next){
  console.log(req.body);
  return next();
}

const jsonMatcher = /application\/json|\*\/\*/;
exports.checkHeaderAcceptJson = function checkHeaderAcceptJson(req, res, next) {
  if (!req.headers.accept || !jsonMatcher.test(req.headers.accept)) {
    return next(new errors.NotAcceptableError("allowed accept: application/json"));
  }
  return next();
};

exports.checkHeaderContentJson = function checkHeaderContentJson(req, res, next) {
    if (!req.headers["content-type"] || !/application\/json/.test(req.headers["content-type"])) {
      return next(new errors.UnsupportedMediaTypeError("allowed content-type: application/json"));
    }
    return next();
};

exports.checkBodyJson = function checkBodyJson(req, res, next) {
    if (!req.body || typeof req.body !== "object") {
      return next(new errors.InvalidContentError("invalid json encoding"));
    }
    return next();
};


exports.errorHandler = function errorHandler(next, logger) {
  return function (error) {
    console.log(error.message);
    // logger.log(error.message);
    return next(new errors.InternalServerError("internal server error"));
  };
};
