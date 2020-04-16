config = require('config.json');
const DB = require('_helpers/db');
const COLLECTION_CUESTIONARIO = DB.Cuestionario;
const COLLECTION_PREGUNTA = DB.Pregunta;

module.exports = {
    getAllCuestionario,
    getCuestionario,
    getCuestionarioCargo,
    getAllPregunta,
    getPregunta,
    addCuestionario,
    addPregunta,
    editCuestionario,
    editPregunta,
    deleteCuestionario,
    deletePregunta
}

async function getAllCuestionario() {
    return (await COLLECTION_CUESTIONARIO.find());
}

async function getCuestionario(idCuestionario) {
    return (await COLLECTION_CUESTIONARIO.findById(idCuestionario));
}

async function getCuestionarioCargo(cargo) {
    return (await COLLECTION_CUESTIONARIO.findOne({ cargo: cargo }));
}

async function getAllPregunta() {
    return(await COLLECTION_PREGUNTA.find());
}

async function getPregunta(idPregunta) {
    return (await COLLECTION_PREGUNTA.findById(idPregunta));
}

async function addCuestionario(attributes) {
    try {
        const NEW_CUESTIONARIO = new COLLECTION_CUESTIONARIO(attributes);
        await NEW_CUESTIONARIO.save();
    } catch (error) {
        throw error;
    }
}

async function addPregunta(attributes) {
    try {
        const NEW_PREGUNTA = new COLLECTION_PREGUNTA(attributes);
        await NEW_PREGUNTA.save();
    } catch (error) {
        throw error;
    }
}

async function editCuestionario(idEvaluador, newAttributes) {
    try {
        await COLLECTION_CUESTIONARIO.findOneAndUpdate({
                _id: idCuestionario
            },
            newAttributes
        );
    } catch (error) {
        throw error;
    }
}

async function editPregunta(idPregunta, newAttributes) {
    try {
        await COLLECTION_PREGUNTA.findOneAndUpdate({
                _id: idPregunta
            },
            newAttributes
        );
    } catch (error) {
        throw error;
    }
}

async function deleteCuestionario(idCuestionario) {
    try {
        await COLLECTION_CUESTIONARIO.findOneAndRemove({
            _id: idCuestionario
        })
    } catch (error) {
        throw error;
    }
}

async function deletePregunta(idPregunta) {
    try {
        await COLLECTION_PREGUNTA.findOneAndRemove({
            _id: idPregunta
        });
    } catch (error) {
        throw error;
    }
}