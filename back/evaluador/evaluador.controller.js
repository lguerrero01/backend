const express = require('express');
const router = express.Router();
const EVALUADOR_SERVICE = require('./evaluador.service');
module.exports = router;

//routes
router.get('/getAllEvaluador', getAllEvaluador)
router.get('/getEvaluador/:id', getEvaluador);
router.post('/addEvaluador', addEvaluador);
router.put('/editEvaluador/:id', editEvaluador);
router.delete('/deleteEvaluador/:id', deleteEvaluador);
router.get('/prueba', probarFuncion);

function getAllEvaluador(req, res, next) {
    EVALUADOR_SERVICE.getAllEvaluador()
        .then((AllEvaluador) => res.json(AllEvaluador))
        .catch((err) => next(err));
}

function getEvaluador(req, res, next) {
    EVALUADOR_SERVICE.getEvaluador(req.params.id)
        .then((evaluador) => res.json(evaluador))
        .catch((err) => next(err));
}

function addEvaluador(req, res, next) {
    EVALUADOR_SERVICE.addEvaluador(req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function editEvaluador(req, res, next) {
    EVALUADOR_SERVICE.editEvaluador(req.params.id, req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function deleteEvaluador(req, res, next) {
    EVALUADOR_SERVICE.deleteEvaluador(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function probarFuncion(req, res, next) {
    EVALUADOR_SERVICE.preguntasPorDia();
    // EVALUADOR_SERVICE.evaluadoresAleatorios();
    // EVALUADOR_SERVICE.repetirPreguntas();
    // EVALUADOR_SERVICE.prueba(); //funcion para probar consultas con async/await

    res.json({})
}