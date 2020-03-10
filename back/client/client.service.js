/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
config = require('config.json');
const funciones = require('../_helpers/funciones.js');
var db = require('_helpers/db');
var Clientes = db.Clientes;
var Ubicacion = db.Ubicacion;
var Cargos = db.Cargos;
var Roll = db.Roll;
var Turnos = db.Turnos;
const Estados = db.Estados;

var refreshTokens = {};

module.exports = {
	getUbicacionId,
	getRollId,
	getTurnoId,
	getAllCliente,
	getAllCargos,
	getAllRoll,
	getAllTurnos,
	getUbicacion,
	getCargos,
	getRoll,
	getTurnos,
	getAllEstados,
	addCliente,
	addUbicacion,
	addCargo,
	addRoll,
	addTurno,
	addEstado,
	updateCliente,
	updateUbicacion,
	updateCargo,
	updateRoll,
	updateTurno,
	updateEstado,
	deleteCargos,
	deleteRoll,
	deleteTurnos,
	deleteEstado,
	updateStatusUbicacion
};

//----------------------------------------------Consulta de Datos Cliente ---------------------------------------
async function getUbicacionId(id) {
	console.log('.-.');
	return await Ubicacion.findById(id);
}

async function getRollId(id) {
	return await Roll.findById(id);
}

async function getTurnoId(id) {
	return await Turnos.findById(id);
}

async function getAllCliente() {
	return await Clientes.find();

}

async function getAllCargos() {
	return await Cargos.find();
}

async function getAllRoll() {
	return await Roll.find();
}

async function getAllTurnos() {
	return await Turnos.find();
}

async function getUbicacion(cliente) {
	let ubicaciones = await Ubicacion.find({
		cliente: cliente
	})
		.populate('cargos.cargo', 'descripcion')
		.populate('cargos.roles.roll')
		.populate('cargos.roles.turnos.turno');
	return (ubicaciones);
}

async function getCargos(ubicacion) {
	//let cargos = [];
	await Ubicacion.findById(ubicacion).populate('cargos.cargo', (err, data) => {
		cargos = data;
	});
	return cargos;
}

async function getRoll(ubicacion, cargo) {
	let ubic = await Ubicacion.findById(ubicacion).populate('cargos.roles.roll');
	let car = ubic.cargos.find((d) => d.cargo._id == cargo);
	return car.roles.map((f) => f.roll);

}

async function getTurnos(ubicacion, cargo, roll) {
	let ubic = await Ubicacion.findById(ubicacion).populate('cargos.roles.turnos');
	let car = ubic.cargos.find((d) => d.cargo._id == cargo);
	let rol = car.roles.find((e) => e.roll._id == roll);
	return rol.turnos;
	/*
	let newUbicacion = await Ubicacion.findOne({ ubicacion: ubicacion });
	let indexCargo = newUbicacion.cargos.indexOf(cargo);
	let indexRoll = newUbicacion.roll[indexCargo].indexOf(roll);
	return newUbicacion.populate('turnos').exec((err, turnos) => {
			return (turnos[indexCargo][indexRoll]);
	});
	*/
}

async function getAllEstados(){
	return await Estados.find({});
}

//------------------------------------------------inserccion de datos Cliente ----------------------------------------

async function addCliente(clienteParam) {
	if (await Clientes.findOne({
		descripcion: clienteParam.descripcion
	})) {
		throw ('Ya existe ' + clienteParam.descripcion);
	}
	const cliente = new Clientes(clienteParam);
	await cliente.save((error) => {
		if (error) {
			throw error;
		}
	});
	console.log(cliente._id);
	return cliente._id;
}

async function addUbicacion(ubicacionParam) {

	const ubicacion = new Ubicacion(ubicacionParam);
	await ubicacion.save((error, b) => {
		console.log(error, b);
	});

}

async function addCargo(cargoParam) {
	if (await Cargos.findOne({
		descripcion: cargoParam.descripcion
	})) {
		throw ('Ya existe ' + cargoParam.descripcion);
	}
	const cargo = new Cargos(cargoParam);
	await cargo.save();
	console.log(cargo);
}

async function addRoll(rollParam) {
	if (await Roll.findOne({
		descripcion: rollParam.descripcion
	})) {
		throw ('Ya existe ' + rollParam.descripcion);
	}
	const roll = new Roll(rollParam);
	await roll.save();
	console.log(roll);
}

async function addTurno(turnoParam) {
	if (await Turnos.findOne({
		descripcion: turnoParam.descripcion
	})) {
		throw ('Ya existe ' + turnoParam.descripcion);
	}
	const turno = new Turnos(turnoParam);
	await turno.save();
	console.log(turno);
}

async function addEstado(estadoParam) {
	const existe = await funciones.validateExist(Estados,'nombre',estadoParam.nombre);
	if(!existe.validate) throw "El Estado "+ estadoParam.nombre + " ya existe";
	const estado = new Estados(estadoParam);
	await estado.save();
}

//----------------------------------------------Update de datos Cliente-------------------------------------------- 

async function updateCliente(id, clienteParam) {
	const cliente = await Clientes.findById(id);

	// validate
	if (!cliente) throw 'Cliente not found';

	Object.assign(cliente, clienteParam);
	await cliente.save();
}

async function updateUbicacion(id, ubicacionParam) {
	const ubicacion = await Ubicacion.findById(id);
	// validate
	if (!ubicacion) throw 'Ubicacion not found';
	// copy clienteParam properties to cliente
	Object.assign(ubicacion, ubicacionParam);
	await ubicacion.save();
}

async function updateStatusUbicacion(id) {

	const ubicacion = await Ubicacion.findById(id);
	ubicacion.status = !ubicacion.status;
	await ubicacion.save();

}

async function updateCargo(id, cargoParam) {
	const cargo = await Cargos.findById(id);

	// validate
	if (!cargo) throw 'Cargo not found';

	if (cargo.descripcion !== cargoParam.descripcion && await Cargos.findOne({
		descripcion: cargoParam.descripcion
	})) {
		throw 'DescripcionCargo "' + cargoParam.descripcion + '" is already taken';
	}
	// copy clienteParam properties to cliente
	Object.assign(cargo, cargoParam);
	await cargo.save();
}

async function updateRoll(id, rollParam) {
	const roll = await Roll.findById(id);

	// validate
	if (!roll) throw 'Roll not found';

	if (roll.descripcion !== rollParam.descripcion && await Roll.findOne({
		descripcion: rollParam.descripcion
	})) {
		throw 'DescripcionRoll "' + rollParam.descripcion + '" is already taken';
	}
	// copy clienteParam properties to cliente
	Object.assign(roll, rollParam);
	await roll.save();
}

async function updateTurno(id, turnoParam) {
	const turno = await Turnos.findById(id);

	// validate
	if (!turno) throw 'Turno not found';

	if (turno.descripcion !== turnoParam.descripcion && await Turnos.findOne({
		descripcion: turnoParam.descripcion
	})) {
		throw 'DescripcionTurno "' + turnoParam.descripcion + '" is already taken';
	}
	// copy clienteParam properties to cliente
	Object.assign(turno, turnoParam);
	await turno.save();
}

async function updateEstado(id,estadoParam) {
	const existe = await funciones.validateExist(Estados,'_id',id);
	if(existe.validate) throw "El Estado "+ estadoParam.nombre + " no existe";
	const resp  = await Estados.findOneAndUpdate({_id:id},estadoParam);
	console.log(resp);
}
//----------------------------------------Dalete de datos cliente-----------------------------------
async function deleteCargos(id) {
	await Cargos.findByIdAndRemove(id);
}
async function deleteRoll(id) {
	await Roll.findByIdAndRemove(id);
}
async function deleteTurnos(id) {
	await Turnos.findByIdAndRemove(id);
}

async function deleteEstado(id) {
	const existe = await funciones.validateExist(Estados,'_id',id);
	if(existe.validate) throw "El Estado no existe";
	const resp = await Estados.findOneAndRemove({_id:id});
	console.log(resp);
}
