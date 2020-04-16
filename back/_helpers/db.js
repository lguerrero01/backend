/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
var config = require("config.json");
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
	useNewUrlParser: true,
	useCreateIndex: true
});

mongoose.Promise = global.Promise;

module.exports = {
	Users: require('../auth/auth.model').Users,
	Evaluador: require('../evaluador/evaluador.model').EVALUADOR
    Cuestionario: require('../cuestionario/cuestionario.model').CUESTIONARIO,
    Pregunta: require('../cuestionario/cuestionario.model').PREGUNTA
};