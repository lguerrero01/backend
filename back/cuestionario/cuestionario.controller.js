const express = require('express');
const router = express.Router();
const CUESTIONARIO_SERVICE = require('./cuestionario.service');
module.exports = router;

//routes
router.get('/getAllCuestionario', getAllCuestionario)
router.get('/getCuestionario/:id', getCuestionario);
router.get('/getCuestionarioCargo/:cargo', getCuestionarioCargo);
router.post('/addCuestionario', addCuestionario);
router.put('/editCuestionario/:id', editCuestionario);
router.delete('/deleteCuestionario/:id', deleteCuestionario);


router.get('/getAllPregunta', getAllPregunta)
router.get('/getPregunta/:id', getPregunta);
router.post('/addPregunta', addPregunta);
router.put('/editPregunta/:id', editPregunta);
router.delete('/deletePregunta/:id', deletePregunta);

function getAllCuestionario(req, res, next) {
    CUESTIONARIO_SERVICE.getAllCuestionario()
        .then((AllCuestionario) => res.json(AllCuestionario))
        .catch((err) => next(err));
}

function getCuestionario(req, res, next) {
    CUESTIONARIO_SERVICE.getCuestionario(req.params.id)
        .then((cuestionario) => res.json(cuestionario))
        .catch((err) => next(err));
}

function getCuestionarioCargo(req, res, next) {
    CUESTIONARIO_SERVICE.getCuestionario(req.params.cargo)
        .then((cuestionario) => res.json(cuestionario))
        .catch((err) => next(err));
}

function addCuestionario(req, res, next) {
    CUESTIONARIO_SERVICE.addCuestionario(req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function editCuestionario(req, res, next) {
    CUESTIONARIO_SERVICE.editCuestionario(req.params.id, req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function deleteCuestionario(req, res, next) {
    CUESTIONARIO_SERVICE.deleteCuestionario(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}


//CRUD PREGUNTAS

function getAllPregunta(req, res, next) {
    CUESTIONARIO_SERVICE.getAllPregunta()
        .then((Allpregunta) => res.json(getAllPregunta))
        .catch((err) => next(err));
}

function getPregunta(req, res, next) {
    CUESTIONARIO_SERVICE.getPregunta(req.params.id)
        .then((pregunta) => res.json(pregunta))
        .catch((err) => next(err));
}

function addPregunta(req, res, next) {
    CUESTIONARIO_SERVICE.addPregunta(req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function editPregunta(req, res, next) {
    CUESTIONARIO_SERVICE.editPregunta(req.params.id, req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function deletePregunta(req, res, next) {
    CUESTIONARIO_SERVICE.deletePregunta(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}