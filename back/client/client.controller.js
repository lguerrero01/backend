/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
const express = require('express');
const router = express.Router();
const clienteService = require('./client.service');
module.exports = router;

// routes
router.put('/cliente/updateStatusUbicacion', updateStatusUbicacion);
router.get('/ubicacionId/:id', getUbicacionId);
router.get('/rollId/:id', getRollId);
router.get('/turnoId/:id', getTurnoId);
router.get('/cliente', getAllCliente);
router.get('/cargos', getAllCargos);
router.get('/roll', getAllRoll);
router.get('/turnos', getAllTurnos);
router.get('/estados', getAllEstados);
router.get('/ubicacion/:cliente', getUbicacion);
router.get('/cargos/:ubicacion', getCargos);
router.get('/roll/:ubicacion/:cargo', getRoll);
router.get('/turnos/:ubicacion/:cargo/:roll', getTurnos);
router.post('/cliente', addCliente);
router.post('/ubicacion', addUbicacion);
router.post('/cargos', addCargo);
router.post('/roll', addRoll);
router.post('/turnos', addTurno);
router.post('/estados', addEstado);
router.put('/cliente/:id', updateCliente);
router.put('/ubicacion/:id', updateUbicacion);
router.put('/cargos/:id', updateCargo);
router.put('/roll/:id', updateRoll);
router.put('/turnos/:id', updateTurno);
router.put('/estados/:id', updateEstado);
router.delete('/cargos/:id', deleteCargos);
router.delete('/roll/:id', deleteRoll);
router.delete('/turnos/:id', deleteTurnos);
router.delete('/estados/:id', deleteEstado);

//----------------------------------------GET-------------------------------------------
function updateStatusUbicacion(req, res, next) {
	console.log('HolaBb');
	clienteService.updateStatusUbicacion(req.body.id)
		.then((ubicacion) => res.json(ubicacion))
		.catch((err) => next(err));
}

function getUbicacionId(req, res, next) {
	clienteService.getUbicacionId(req.params.id)
		.then((ubicacion) => res.json(ubicacion))
		.catch((error) => next(error));
}

function getRollId(req, res, next) {
	clienteService.getRollId(req.params.id)
		.then((roll) => res.json(roll))
		.catch((error) => next(error));
}

function getTurnoId(req, res, next) {
	clienteService.getTurnoId(req.params.id)
		.then((turno) => res.json(turno))
		.catch((error) => next(error));
}

function getAllCliente(req, res, next) {
	clienteService.getAllCliente()
		.then((clientes) => res.json(clientes))
		.catch((err) => {
			console.log('Mensaje de Error: ', err);
			next(err);
		});
}

function getAllCargos(req, res, next) {
	clienteService.getAllCargos()
		.then((cargos) => res.json(cargos))
		.catch((err) => {
			console.log('Mensaje de Error: ', err);
			next(err);
		});
}

function getAllRoll(req, res, next) {
	clienteService.getAllRoll()
		.then((rolls) => res.json(rolls))
		.catch((err) => {
			console.log('Mensaje de Error: ', err);
			next(err);
		});
}

function getAllTurnos(req, res, next) {
	clienteService.getAllTurnos()
		.then((turnos) => res.json(turnos))
		.catch((err) => {
			console.log('Mensaje de Error: ', err);
			next(err);
		});
}

function getUbicacion(req, res, next) {
	clienteService.getUbicacion(req.params.cliente)
		.then((ubicacion) => ubicacion ? res.json(ubicacion) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getCargos(req, res, next) {
	clienteService.getCargos(req.params.ubicacion)
		.then((cargos) => res.json(cargos))
		.catch((err) => {
			console.log('Mensaje de Error: ', err);
			next(err);
		});
}

function getRoll(req, res, next) {
	clienteService.getRoll(req.params.ubicacion, req.params.cargo)
		.then((roll) => roll ? res.json(roll) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getTurnos(req, res, next) {
	clienteService.getTurnos(req.params.ubicacion, req.params.cargo, req.params.roll)
		.then((turnos) => turnos ? res.json(turnos) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getAllEstados(req,res,next) {
	clienteService.getAllEstados()
		.then((estados)=>estados?res.json(estados): res.sendStatus(404))
		.catch((error) => next(error));
}
//------------------------------POST---------------------------------------------------------

function addCliente(req, res, next) {
	clienteService.addCliente(req.body)
		.then((idCliente) => res.json(idCliente))
		.catch((err) => next(err));
}

function addUbicacion(req, res, next) {
	clienteService.addUbicacion(req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function addCargo(req, res, next) {
	clienteService.addCargo(req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function addRoll(req, res, next) {
	clienteService.addRoll(req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function addTurno(req, res, next) {
	clienteService.addTurno(req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function addEstado(req, res, next) {
	clienteService.addEstado(req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}
//-----------------------------PUT-------------------------------------------------------------
function updateCliente(req, res, next) {
	clienteService.updateCliente(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function updateUbicacion(req, res, next) {
	clienteService.updateUbicacion(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function updateCargo(req, res, next) {
	clienteService.updateCargo(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function updateRoll(req, res, next) {
	clienteService.updateRoll(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function updateTurno(req, res, next) {
	clienteService.updateTurno(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function updateEstado(req, res, next) {
	clienteService.updateEstado(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}
//----------------------------DELETE-------------------------------------------------------------
function deleteCargos(req, res, next) {
	clienteService.deleteCargos(req.params.id)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function deleteRoll(req, res, next) {
	clienteService.deleteRoll(req.params.id)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function deleteTurnos(req, res, next) {
	clienteService.deleteTurnos(req.params.id)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function deleteEstado(req, res, next) {
	clienteService.deleteEstado(req.params.id)
		.then(() => res.json({}))
		.catch((err) => next(err));
}