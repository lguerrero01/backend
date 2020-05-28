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
    },
    periodicidad: { //tiempo que se repetira la encuesta
        type: Number,
        // require: true
    },
    tiempoCuestionario: { // tiempo en que se debe terminar la encuesta 
        type: Number,
        require: true
    },
    pregunta: [{
        type: Schema.Types.ObjectId,
        ref: 'Preguntas'
    }],
    personasEvaluadas: [{
        identificador: String,
        date: Date
    }]

});


const preguntasSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: true
    }

});

const EVALUADOR = mongoose.model('Evaluador', evaluadorSchema);

const PREGUNTAS = mongoose.model('Pregunta', preguntasSchema);

module.exports = {
    EVALUADOR
}