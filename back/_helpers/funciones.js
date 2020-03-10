// const csv = require("csv-parse");
// const fs = require("fs");
const db = require("./db.js");

function getDataCSV(path, callback) {
	return new Promise((res, rej) => {
		let results = [];
		let formateo = [];
		let parcer = csv({
			headers: true,
			delimiter: ";"
		});
		fs.createReadStream(path)
			.pipe(parcer)
			.on("data", data => {
				results.push(data);
			})
			.on("error", function (err) {
				console.error(err);
			})
			.on("end", () => {
				if (results) {
					let indices = [];
					results.forEach((current, index, arr) => {
						if (index == 0) {
							indices = current.map(i => i);
						} else {
							let objeto = new Object();
							current.forEach((currentV, indexV) => {
								objeto[indices[indexV]] = currentV.toLowerCase();
							});
							formateo[index - 1] = objeto;
						}
					});

					fs.unlink(path, err => {
						rej(err);
					});
					let respCall = {};
					if (typeof callback == "function") {
						respCall = callback(formateo);
					}
					let respuesta = {
						index: indices,
						data: formateo
					};

					Object.assign(respuesta, respCall);
					res(respuesta);
				}
			});
	});
}

function renombrarPropiedad(objeto, oldName, newName) {
	//Do nothing if the names are the same
	if (oldName == newName) {
		return objeto;
	}
	//Check for the old property name to avoid a ReferenceError in strict mode.
	if (objeto.hasOwnProperty(oldName)) {
		objeto[newName] = objeto[oldName];
		delete objeto[oldName];
	}
	return objeto;
}

function renameIndexJSON(array, changes) {
	return new Promise((res, rej) => {
		if (array.length > 0) {
			let newArray = array.map((res, index, arr) => {
				changes.forEach(change => {
					renombrarPropiedad(res, change.old, change.new);
				});
				return res;
			});
			res(newArray);
		} else {
			rej("Array Vacio");
		}
	});
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function validate(schema, data, metodo) {
	if (schema) {
		let errores = {};
		switch (metodo) {
			case 0:
				errores.requeridos = [];
				const requeridos = Object.keys(
					schema.schema.paths
				).filter((res, index) =>
					schema.schema.paths[res].isRequired ? res : null
				);
				const indicesData = Object.keys(data);

				requeridos.forEach(res => {
					if (!indicesData.includes(res)) {
						errores.requeridos.push(res);
					}
				});

				break;
			case 1:
				let validar = {};
				validar[data.key] = data.value;
				let repetido = await schema.find(validar);
				if (repetido.length > 0) {
					errores.existe = repetido;
				} else {
					errores.existe = [];
				}
				break;
		}
		return errores;
	}
}

function validateRequired(schema, data) {
	if (schema) {
		let error = {
			required: [],
			validate: true
		};
		const required = Object.keys(schema.schema.paths).filter((res, index) =>
			schema.schema.paths[res].isRequired ? res : null
		);
		required.forEach(validator => {
			if (!data[validator]) {
				error.required.push(validator);
				error.validate = false;
			}
		});
		return error;
	}
	return false;
}

function properties(schema) {
	if (schema) {
		let keys = Object.keys(schema.schema.paths);
		let keysP = [keys];
		let keysV = schema.schema.paths;
		let index = 0;
		while (keysV.paths) {
			keyskeysV[keys[index]];
		}
		keys.forEach(res => {
			console.log(Object.keys(keysV[res]));
		});
		return;
	}
}
async function validateExist(schema, key, value) {
	let error = {
		exist: {},
		validate: true
	};
	if (Boolean(schema && key && value)) {
		const validar = {};
		validar[key] = value;
		let exist = await schema.find(validar);
		if (exist.length) {
			error.exist = exist;
			error.validate = false;
		}
		return error;
	}
	return null;
}

let partesR = [];

function recorrido(objeto) {
	if (Boolean(objeto.schema) && Boolean(objeto.schema.paths)) {
		let keys = Object.keys(objeto.schema.paths);
		for (let i = 0; i < keys.length; i++) {
			partesR.push({
				abuelo: objeto.path,
				padre: keys[i]
			});
			recorrido(objeto.schema.paths[keys[i]]);
		}
	} else {
		return null;
	}
}
module.exports = {
	getDataCSV,
	renameIndexJSON,
	asyncForEach,
	validateExist,
	validateRequired,
	properties
};