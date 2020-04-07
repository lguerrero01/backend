const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evaluadorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    position: { //cargo
        type: String,
        required: true
    },
    ratio: { //alcance 
        tipoAlcance: String,
        clientes: [{
            nombreCliente: String,
            ubicacionCliente: [{
                nombreUbicacion: String,
                poblacion: Number
            }]
        }]
    },
    type: { //tipo
        type: String,
        // required: true
    }
});

const EVALUADOR = mongoose.model('Evaluador', evaluadorSchema);

module.exports = {
    EVALUADOR
}