const mongoose = require("mongoose");
const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const User = db.User;
const Module = db.Access;
const Menu = db.MenuD;
const Item = db.Item;
const GroupItems = db.GroupItems;
const Concepto = db.Conceptos;
const Cuentas = db.Cuentas;
const Categoria = db.Categoria;
const Subcategoria = db.Subcategoria;
// const randT = require("rand-token");
const Development = true;
const funciones = require("../_helpers/funciones.js");

var refreshTokens = {};

module.exports = {
	isLoggedIn,
	gNewTokenAcces,
	authenticate,

	getAll,
	getById,
	getModules,
	getConceptos,
	getItems,
	getGroupsItems,
	getCategoria,
	getSubcategorias,
	getConceptosOfSub,
	getConceptosCuenta,
	getConceptosHuerfanos,
	getConceptos$neDatos,
	create,
	addItem,
	addGroupItems,
	addCategoria,
	addSubcategoria,
	addConcepto,
	desactivarConcepto,
	update,
	updateConcepto,
	updateCategoria,
	updateSubcategoria,
	updateGroupItems,
	updateItem,
	logout,
	delete: _delete,
	deleteCategoria,
	conceptosRefactor
};

async function conceptosRefactor() {
	const conceptos = await Concepto.find({});

	conceptos.forEach(currentConcepto => {
		Object.assign(currentConcepto, {
			constant: false,
			primary: false
		});
		currentConcepto.save(error => {
			if (error) {
				throw error;
			}
		});
	});
}

async function isLoggedIn({
	username
}) {
	const user = await User.findOne({
		username
	});
	if (user !== null) {
		if (user.accesToken !== null) {
			try {
				jwt.verify(user.accesToken, config.secret);
			} catch (error) {
				// console.log(error.name, ' ', error.message);
				if (error.name === "TokenExpiredError" && user.loggedIn) {
					return false;
				}
			}
		}
		return user.loggedIn;
	}
	return null;
}

async function gNewTokenAcces(usernameparam, tokenRefresh) {
	// console.log('Data in refreshTokens: ', refreshTokens);
	// await db.dropCollection('Colection');
	// await db.dropCollection('Subcategoria');
	refreshTokens[tokenRefresh] = usernameparam;
	if (
		tokenRefresh in refreshTokens &&
		refreshTokens[tokenRefresh] === usernameparam
	) {
		var user = await User.findOne({
			username: usernameparam
		});
		// console.log(user);
		if (user) {
			user.accesToken = jwt.sign({
					name: user.username,
					sub: user.id,
					rol: user.rol
				},
				config.secret, {
					expiresIn: Development ? 60 * 60 : 60
				}
			);
			// console.log(user.accesToken);
			await user.save();
			return user.accesToken;
		} else {
			return "User Not Found";
		}
	} else {
		return "User Not Authorized";
	}
}

async function authenticate({
	username,
	password
}) {
	const user = await User.findOne({
		username
	});
	console.log(user);
	if (user && bcrypt.compareSync(password, user.hash)) {
		user.loggedIn = true;
		const {
			hash,
			...userWithoutHash
		} = user.toObject();
		const token = jwt.sign({
				name: username,
				sub: user.id,
				rol: user.rol
			},
			config.secret, {
				expiresIn: Development ? 60 * 60 : 60
			}
		);

		user.accesToken = token;
		const tokenRefresh = randT.generate(16);
		refreshTokens[tokenRefresh] = username;
		await user.save();
		/*console.log('--------------------------------------');
		    console.log('TokenRefresh: ', tokenRefresh);
		    console.log('--------------------------------------');
		    console.log('refreshTokens: ', refreshTokens);*/
		return {
			...userWithoutHash,
			token,
			tokenRefresh
		};
	}
}

async function getAll() {
	return await User.find().select("-hash");
}

async function getById(id) {
	return await User.findOne({
		_id: id
	}).select("-hash");
}

async function getModules(id) {
	let modules = await Module.find({
			idFather: id
		},
		"-idFather -__v -_id"
	);
	let array = Object.keys(modules[0].toObject());
	return array.filter(currentKey => {
		if (modules[0][currentKey]) {
			if (modules[0][currentKey].hasPermissionThisModule) {
				return currentKey;
			}
		}
	});
}

async function getConceptos(tipo) {
	if (tipo !== "Compuesto") {
		return await Concepto.find({
				tipo: tipo
			},
			"-idFather"
		);
	} else {
		let compuestos = await Concepto.find({
				tipo: tipo
			},
			"-idFather"
		).populate("valor.Compuesto.items");
		// console.log(compuestos[0].valor.Compuesto);
		return compuestos;
	}
}

async function getItems(idGroup) {
	return await Item.find({
		idGroup: idGroup
	});
}

async function getGroupsItems() {
	let groupItems = await GroupItems.find().populate("items");
	return groupItems;
}

async function getCategoria() {
	const categorias = await Categoria.find();
	// console.log(categorias);
	return categorias;
}

async function getSubcategorias(id) {
	const subcategorias = await Subcategoria.find({
		idFather: id
	});
	// console.log(subcategorias);
	return subcategorias;
}

async function getConceptosOfSub(idSub) {
	const conceptos = await Concepto.find({
		idSub: idSub
	});
	return conceptos;
}

async function getConceptosCuenta(id) {
	const cuentas = await Concepto.findOne({
		_id: id
	}, 'cuentas').populate('cuentas');
	return cuentas;
}

async function getConceptosHuerfanos() {
	const conceptos = await Concepto.find({
		idSub: null
	});
	return conceptos;
}

async function getConceptos$neDatos() {
	let conceptos = await Concepto.find({
			tipo: {
				$ne: "Dato"
			}
		},
		async (error, response) => {}
	);
	return conceptos;
}

async function create(userParam) {
	console.log(userParam);
	// validate
	// console.log('Dentro de create...');
	if (
		await User.findOne({
			username: userParam.username
		})
	) {
		// console.log('Datos a registrar: ', userParam);
		throw 'Username "' + userParam.username + '" is already taken';
	}
	/*const { modulesSelected, moduleMenu, ...userData } = userParam;
	  modulesSelected.map((currentValue) => {
	      module[currentValue].hasPermissionThisModule = true;
	      // module[currentValue].accessToMenus = moduleMenu[currentValue].menu;
	      moduleMenu[currentValue].menu.map(async(current, index) => {
	          let menu = new Menu();
	          menu.name = current;
	          moduleMenu[currentValue].crud[index].map((data) => {
	              menu[data] = true;
	          });
	          menu.idFather = module._id;
	          module[currentValue].accessToMenus.push(menu._id);
	          await menu.save();
	      });
	  });

	  var user = new User(userData);
	  user.accessToModules = module._id;
	  module.idFather = user._id;
	  await module.save();*/
	const user = new User(userParam);
	user.rol = "Admin";
	// hash password
	if (userParam.password) {
		user.hash = bcrypt.hashSync(userParam.password, 10);
	}
	// save user
	await user.save(error => {
		if (error) {
			console.log(error);
			throw error;
		}
	});
}

async function addItem(id, itemParam) {
	if (
		await Item.findOne({
			descripcion: itemParam.descripcion
		})
	) {
		throw `Ya Existe el Item ${itemParam.descripcion}`;
	} else {
		const item = new Item(itemParam);
		item.idGroup = id;
		await item.save(error => {
			if (error) {
				throw error;
			}
		});
	}
}

async function addGroupItems(groupParam, itemsParam) {
	if (
		await GroupItems.findOne({
			descripcion: groupParam.descripcion
		})
	) {
		throw `Ya Existe el Grupo de Items ${groupItemsParam.descripcion}`;
	} else {
		const groupItems = await new GroupItems(groupParam);
		console.log(groupParam, itemsParam);
		await groupItems.save(error => {
			if (error) {
				throw error;
			}
		});
		await itemsParam.map(async currentValue => {
			await addItem(groupItems._id, currentValue);
		});
	}
}

async function addCategoria(categoriaParam) {
	if (
		await Categoria.findOne({
			descripcion: categoriaParam.categoria.descripcion
		})
	) {
		throw `Ya existe ${categoriaParam.categoria.descripcion}`;
	} else {
		const category = await new Categoria({
			_id: new mongoose.Types.ObjectId(),
			descripcion: categoriaParam.categoria.descripcion
		});
		await category.save(error => {
			if (error) {
				console.log(error);
				throw error;
			}
		});
		await categoriaParam.subcategorias.map(async currentValue => {
			await addSubcategoria(category._id, currentValue);
		});
	}
}

async function addSubcategoria(idFatherParam, subcategoriaParam) {
	if (
		await Subcategoria.findOne({
			descripcion: subcategoriaParam.descripcion
		})
	) {
		throw `Ya Existe La Subcategoria ${subcategoriaParam.descripcion}`;
	} else {
		const subcategoria = await new Subcategoria({
			descripcion: subcategoriaParam.descripcion,
			idFather: idFatherParam
		});
		await subcategoria.save(error => {
			if (error) {
				console.log(
					"No se ha Guardado la SubCategoria ",
					subcategoria.descripcion
				);
				throw error;
			}
		});
	}
}

async function addConcepto(conceptoParam) {
	if (
		await Concepto.findOne({
			descripcion: conceptoParam.descripcion
		})
	) {
		throw "Ya existe " + conceptoParam.descripcion;
	}
	const concepto = new Concepto(conceptoParam);
	// console.log('Concepto Without Value: ', concepto);
	if (conceptoParam.cuentas && conceptoParam.cuentas.length > 0) {
		await funciones.asyncForEach(conceptoParam.cuentas, async res => {
			console.log(res);
			let cuenta = await Cuentas.findOne({
				_id: res
			});
			if (cuenta) {
				cuenta.concepto = concepto._id;
			}
			await cuenta.save();
		});
	}

	if (conceptoParam.valor) {
		concepto.valor[concepto.tipo] = conceptoParam.valor;
	}
	// console.log('Concepto With Value: ', concepto);
	await concepto.save();
}

// ------------------Patch------------------------
async function desactivarConcepto(id, status) {
	// console.log(id);
	await Concepto.findById(id, async (error, response) => {
		if (error) {
			throw error;
		}
		response.status = status.status;
		// console.log(response);
		await response.save(error => {
			if (error) {
				throw error;
			}
		});
	});
}

async function update(id, userParam) {
	const user = await User.findById(id);

	// validate
	if (!user) throw "User not found";

	if (
		user.username !== userParam.username &&
		(await User.findOne({
			username: userParam.username
		}))
	) {
		throw 'Username "' + userParam.username + '" is already taken';
	}

	// hash password if it was entered
	if (userParam.password) {
		userParam.hash = bcrypt.hashSync(userParam.password, 10);
	}

	// copy userParam properties to user
	Object.assign(user, userParam);
	await user.save();
}

async function updateConcepto(id, conceptoParam) {
	const concepto = await Concepto.findById(id);

	if (!concepto) {
		throw "Function UpdateConcepto: Concepto Not Found";
	}

	if (
		concepto.descripcion !== conceptoParam.descripcion &&
		(await Concepto.findOne({
			descripcion: conceptoParam.descripcion
		}))
	) {
		throw `Ya Existe una Categoria con la Descripcion: ${conceptoParam.descripcion}`;
	}

	Object.assign(concepto, conceptoParam);
	await concepto.save((error, response) => {
		if (error) {
			throw error;
		}
		console.log(response);
	});
}

async function updateCategoria(id, categoriaParam, subcategoriasParam) {
	const categoria = await Categoria.findById(id);

	if (!categoria) {
		throw "function UpdateCategoria: Categoria Not Found";
	}

	if (
		categoria.descripcion !== categoriaParam.descripcion &&
		(await Categoria.findOne({
			descripcion: categoriaParam.descripcion
		}))
	) {
		throw `Ya Existe una Categoria con la Descripcion: ${categoriaParam.descripcion}`;
	}
	Object.assign(categoria, categoriaParam);
	await categoria.save(error => {
		if (error) {
			throw error;
		}
	});

	await subcategoriasParam.map(async currentValue => {
		await addSubcategoria(categoria._id, currentValue)
			.then(() => null)
			.catch(error => {
				throw error;
			});
	});
}

async function updateSubcategoria(
	idParam,
	conceptosNewParam,
	conceptosDeleteParam,
	subcategoriaParam
) {
	await Subcategoria.findById(idParam, async (error, response) => {
		if (error) {
			console.log(error);
			throw error;
		}
		if (
			response.descripcion !== subcategoriaParam.descripcion &&
			(await Subcategoria.findOne({
				descripcion: subcategoriaParam.descripcion
			}))
		) {
			throw `Ya Existe una subcategoria con esta Descripcion: ${subcategoriaParam.descripcion}`;
		}
		if (response.descripcion !== subcategoriaParam.descripcion) {
			Object.assign(response, subcategoriaParam);
			console.log(response);
			await response.save(error => {
				if (error) {
					throw error;
				}
			});
		}
	});
	if (conceptosNewParam.length > 0) {
		await conceptosNewParam.forEach(async (value, index) => {
			let concepto = await new Concepto();
			await Concepto.findById(value, async (error, response) => {
				if (error) {
					throw error;
				}
				Object.assign(concepto, response);
				concepto.idSub = idParam;
				await concepto.save(error => {
					if (error) {
						console.log(error);
						throw error;
					}
				});
			});
		});
	}
	if (conceptosDeleteParam.length > 0) {
		await conceptosDeleteParam.forEach(async (value, index) => {
			let concepto = await new Concepto();
			await Concepto.findById(value, async (error, response) => {
				if (error) {
					throw error;
				}
				Object.assign(concepto, response);
				concepto.idSub = null;
				await concepto.save(error => {
					if (error) {
						console.log("Dentro de SaveDelete line 396: ", error);
						throw error;
					}
				});
			});
		});
	}
}

async function updateGroupItems(idGroupParam, groupParam) {
	console.log(idGroupParam, groupParam);
	await GroupItems.findById(idGroupParam, async (error, response) => {
		if (error) {
			throw error;
		}
		if (
			response.descripcion !== groupParam.descripcion &&
			(await Subcategoria.findOne({
				descripcion: groupParam.descripcion
			}))
		) {
			throw `Ya Existe una subcategoria con esta Descripcion: ${groupParam.descripcion}`;
		}
		if (response.descripcion !== groupParam.descripcion) {
			Object.assign(response, groupParam);
			response.save(error => {
				if (error) {
					throw error;
				}
			});
		}
	});
}

async function updateItem(idParam, itemParam) {
	console.log("QlqDq");
	await Item.findById(idParam, async (error, response) => {
		if (error) {
			throw error;
		}
		if (
			response.descripcion !== itemParam.descripcion &&
			(await Subcategoria.findOne({
				descripcion: itemParam.descripcion
			}))
		) {
			throw `Ya Existe una subcategoria con esta Descripcion: ${itemParam.descripcion}`;
		}
		Object.assign(response, itemParam);
		response.save(error => {
			if (error) {
				throw error;
			}
		});
	});
}

async function logout(id, userParam) {
	var user = await User.findById(id);
	if (!user) {
		console.log("User not found");
		throw "User not found";
	}
	user.loggedIn = false;
	user.accesToken = "null";
	await user.save();
}

async function _delete(id) {
	await User.findByIdAndRemove(id);
}

async function deleteCategoria(id) {
	await Categoria.findByIdAndRemove(id);
}