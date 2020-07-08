const errors = require("restify-errors");

const jsonMatcher = /application\/json|\*\/\*/;
exports.validateHeaderAcceptJson = function validateAcceptJson(req, res, next) {
  if (req.headers.accept && !jsonMatcher.test(req.headers.accept)) {
    return next(new errors.NotAcceptableError("allowed accept: application/json"));
  }
  return next();
};

exports.validateHeaderContentJson = function validateHeaderContentJson(req, res, next) {
    if (!req.headers["content-type"] || !/application\/json/.test(req.headers["content-type"])) {
      return next(new errors.UnsupportedMediaTypeError("allowed content-type: application/json"));
    }
    return next();
};

exports.validateBodyJson = function validateBodyJson(req, res, next) {
    if (!req.body || typeof req.body !== "object") {
      return next(new errors.InvalidContentError("invalid json encoding"));
    }
    return next();
};

exports.registerHackHidder = function registerHackHidder(server, logger) {
    server.on("ImATeapot", function (req, res, err) {
      console.log(err.message);
      res.send(200);
    });
};
  
  exports.registerUncaughtExceptionHandler = function registerUncaughtExceptionHandler(server, logger) {
    server.on("uncaughtException", function (req, res, route, err) {
      console.log(route, err.message); 
      res.send(new errors.InternalServerError());
    });
};

exports.makeDefaultErrorHandler = function makeDefaultErrorHandler(next, logger) { // eslint-disable-line no-unused-vars
  return function (error) {
    console.log(error.message); /** @todo to be replaced with call to logger */ //eslint-disable-line no-console
    if (error.name === "MongooseError" || error.name === "ValidationError") {
      return next(new errors.BadRequestError(error.message));
    } else if (error.name === "MongoError" && error.code === 11000) { // eslint-disable-line no-magic-numbers
      return next(new errors.ForbiddenError("already exists"));
    } else if (error.name === "MongoError" && error.code === 16755) { // eslint-disable-line no-magic-numbers
      return next(new errors.BadRequestError(error.message.substr(error.message.lastIndexOf("}") + 2)));
    }
    return next(new errors.InternalServerError("internal server error. Retry later or contact support"));
  };
};