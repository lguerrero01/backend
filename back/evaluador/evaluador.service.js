config = require('config.json');
const DB = require('_helpers/db');
const COLLECTION_EVALUADOR = DB.Evaluador;

module.exports = {
    getAllEvaluador,
    getEvaluador,
    addEvaluador,
    editEvaluador,
    deleteEvaluador,
    preguntasPorDia
}

async function getAllEvaluador() {
    return (await COLLECTION_EVALUADOR.find());
}

async function getEvaluador(idEvaluador) {
    return (await COLLECTION_EVALUADOR.findById(idEvaluador));
}

async function addEvaluador(attributes) {
    try {
        const NEW_EVALUADOR = new COLLECTION_EVALUADOR(attributes);
        await NEW_EVALUADOR.save();
    } catch (error) {
        throw error;
    }
}

async function editEvaluador(idEvaluador, newAttributes) {
    try {
        await COLLECTION_EVALUADOR.findOneAndUpdate({
                _id: idEvaluador
            },
            newAttributes
        );
    } catch (error) {
        throw error;
    }
}
async function deleteEvaluador(idEvaluador) {
    try {
        await COLLECTION_EVALUADOR.findOneAndRemove({
            _id: idEvaluador
        })
    } catch (error) {
        throw error;
    }
}

async function preguntasPorDia (){
    const evaluadores = await COLLECTION_EVALUADOR.find();
    const poblacion = consulta por hacerce;

    evaluadores.forEach((evaluador) => {
        const dias = Math.ceil(evaluador.tiempoCuestionario / evaluador.periodicididad);
        const preguntasPorDia = Math.ceil(dias / cantPreguntas);
        const cantEvaluarTiempo = Math.ceil(cantPreguntas / preguntasPorDia); 
        const tiempoEvaluarPersona =  Math.ceil(dias / cantEvaluarTiempo);
        const personaPorDia = math.ceil(poblacion / tiempoEvaluarPersona);
    });
}

