/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
const express = require('express');
const router = express.Router();
const userService = require('./user.service');
// routes
router.get('/conceptosRefactor', conceptosRefactor);
router.get('/getConceptosNe', getConceptosNe);
router.get('/getH', getH);
router.get('/getGroupsItems', getGroupsItems);
router.get('/getItems/:idGroup', getItems);
router.get('/getCategoria', getCategoria);
router.get('/getSubcategorias/:id', getSubcategorias);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/modules/:id', getModules);
router.get('/conceptos/:tipo', getConceptos);
router.get('/getConceptosOfSub/:idSub', getConceptosOfSub);
router.get('/getConceptosCuenta/:id', getConceptosCuenta);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/token', gNewTokenAcces);
router.post('/addCategoria', addCategoria);
router.post('/addSubcategoria', addSubcategoria);
router.post('/addConcepto', addConcepto);
router.post('/addItem/:id', addItem);
router.post('/addGroupItems', addGroupItems);
router.put('/desactivarConcepto/:id', desactivarConcepto);
router.put('/:id', update);
router.put('/updateConcepto/:id', updateConcepto);
router.put('/updateCategoria/:id', updateCategoria);
router.put('/updateSubcategoria/:id', updateSubcategoria);
router.put('/updateGroupItems/:id', updateGroupItems);
router.put('/updateItem/:id', updateItem);
router.put('/logout/:id', logout);
router.delete('/:id', _delete);
router.delete('/deleteCategoria/:id', deleteCategoria);
module.exports = router;

function authenticate(req, res, next) {
	userService.isLoggedIn(req.body)
		.then((loggedIn) => {
			if (loggedIn) {
				res.status(400).json({
					message: 'Este Usuario ya posee sesion activa'
				});
			} else {
				userService.authenticate(req.body)
					.then((user) => user ? res.json(user) : res.status(400).json({
						message: 'Username or password is incorrect'
					}))
					.catch((err) => next(err));
			}
		})
		.catch((err) => next(err));
}

function register(req, res, next) {
	userService.create(req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function gNewTokenAcces(req, res, next) {
	userService.gNewTokenAcces(req.body.username, req.body.tokenRefresh)
		.then((newTokenAcces) => {
			if (newTokenAcces !== 'User Not Found' && newTokenAcces !== 'User Not Authorized') {
				res.json(newTokenAcces);
			} else if (newTokenAcces === 'User Not Found') {
				res.status(400).json({
					message: newTokenAcces
				});
			} else {
				res.status(401).json({
					message: newTokenAcces
				});
			}
		})
		.catch((err) => next(err));
}

function addCategoria(req, res, next) {
	// console.log('#######', req.body);
	userService.addCategoria(req.body)
		.then(() => res.json({}))
		.catch((error) => {
			console.log('Error: ', error);
			next(error);
		});
}

function addSubcategoria(req, res, next) {
	userService.addSubcategoria(req.body)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function addConcepto(req, res, next) {
	userService.addConcepto(req.body)
		.then(() => res.json({}))
		.catch((error) => {
			console.log(error.message);
			next(error);
		});
}

function addItem(req, res, next) {
	userService.addItem(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function addGroupItems(req, res, next) {
	userService.addGroupItems(req.body.grupo, req.body.items)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function getAll(req, res, next) {
	userService.getAll()
		.then((users) => res.json(users))
		.catch((err) => {
			console.log('Mensaje de Error: ', err);
			next(err);
		});
}

function getCurrent(req, res, next) {
	userService.getById(req.user.sub)
		.then((user) => user ? res.json(user) : res.sendStatus(404))
		.catch((err) => next(err));
}

function getById(req, res, next) {
	userService.getById(req.params.id)
		.then((user) => user ? res.json(user) : res.sendStatus(404))
		.catch((err) => next(err));
}

function getModules(req, res, next) {
	userService.getModules(req.params.id)
		.then((modules) => modules ? res.json(modules) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getConceptos(req, res, next) {
	userService.getConceptos(req.params.tipo)
		.then((conceptos) => conceptos ? res.json(conceptos) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getItems(req, res, next) {
	userService.getItems(req.params.idGroup)
		.then((items) => (items) ? res.json(items) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getGroupsItems(req, res, next) {
	userService.getGroupsItems()
		.then((groupItems) => (groupItems) ? res.json(groupItems) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getCategoria(req, res, next) {
	// console.log('Dentro De Get Categoria');
	userService.getCategoria()
		// .then(() => res.json({}))
		.then((categoria) => categoria ? res.json(categoria) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getSubcategorias(req, res, next) {
	userService.getSubcategorias(req.params.id)
		.then((subcategorias) => subcategorias ? res.json(subcategorias) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getConceptosOfSub(req, res, next) {
	userService.getConceptosOfSub(req.params.idSub)
		.then((conceptos) => conceptos ? res.json(conceptos) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getConceptosCuenta(req, res, next) {
	console.log(req.params.id)
	userService.getConceptosCuenta(req.params.id)
		.then((conceptos) => conceptos ? res.json(conceptos) : res.sendStatus(404))
		.catch((error) => next(error));
}


function getH(req, res, next) {
	// console.log('Huerfanos');
	userService.getConceptosHuerfanos()
		.then((conceptos) => conceptos ? res.json(conceptos) : res.sendStatus(404))
		.catch((error) => next(error));
}

function getConceptosNe(req, res, next) {
	// console.log('QueNoSeanDatos');
	userService.getConceptos$neDatos()
		.then((conceptos) => conceptos ? res.json(conceptos) : res.sendStatus(404))
		.catch((error) => next(error));
}

// ------------------------Patch Update-------------------------
function desactivarConcepto(req, res, next) {
	console.log('KhePasó?');
	userService.desactivarConcepto(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

//-----------------------Put Update---------------------------------
function update(req, res, next) {
	userService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function updateConcepto(req, res, next) {
	userService.updateConcepto(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function updateCategoria(req, res, next) {
	userService.updateCategoria(req.params.id, req.body.categoria, req.body.subcategorias)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function updateSubcategoria(req, res, next) {
	userService.updateSubcategoria(req.params.id, req.body.conceptosNew, req.body.conceptosDelete, req.body.subcategoria)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function updateGroupItems(req, res, next) {
	console.log('HolaBb');
	userService.updateGroupItems(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function updateItem(req, res, next) {
	console.log('HolaDeNuevo');
	userService.updateItem(req.params.id, req.body)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function logout(req, res, next) {
	userService.logout(req.params.id)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function _delete(req, res, next) {
	userService.delete(req.params.id)
		.then(() => res.json({}))
		.catch((err) => next(err));
}

function deleteCategoria(req, res, next) {
	userService.deleteCategoria(req.params.id)
		.then(() => res.json({}))
		.catch((error) => next(error));
}

function conceptosRefactor(req, res, next) {
	console.log('Hola');
	userService.conceptosRefactor()
		.then(() => res.json({}))
		.catch((error) => next(error));
}
