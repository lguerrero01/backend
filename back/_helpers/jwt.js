const expressJwt = require('express-jwt');
const config = require('config.json');
const authService = require('../auth/auth.service');
const clientService = require('../client/client.service');

module.exports = jwt;

function jwt() {
	const secret = config.secret;
	return expressJwt({
		secret,
		isRevoked
	}).unless({
		path: [
			// Lista de rutas que no requieren Autenticación
			'/api/login',
			'/api/register'


		]
	});
}

async function isRevoked(req, payload, done) {
	const user = await authService.getById(payload.id);
	// Rovacar Toen si el usuario no existe
	if (!user) {
		console.log('User Not Found');
		return done(null, true);
	}

	done();
};