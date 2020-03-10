require("rootpath")();
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var jwt = require("_helpers/jwt");
var errorHandler = require("_helpers/error-handler");

app.use(bodyParser.urlencoded({
	limit: "150mb",
	extended: false
}));

app.use(bodyParser.json({
	limit: "150mb"
}));
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());
// api routes

app.use('/api', require("./auth/auth.controller"));
app.use('/evaluador', require("./evaluador/evaluador.controller"));

// global error handler
app.use(errorHandler);

// start server

var port =
	process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;
var server = app.listen(port, function () {
	console.log("Server listening on port " + port);
});