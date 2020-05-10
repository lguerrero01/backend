const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuestionarioSchema = new Schema({

    cuestionario: [{
        type: Schema.Types.ObjectId,
        ref: 'Pregunta'
    }],
    cargo: {
        type: String,
        default: '',
        unique: true,
        require: true
    }


});


const preguntasSchema = new Schema({
    descripcion: {
        type: String,
        default: '',
        unique: true,
        require: true
    },
    clasificacion: {
        type: String,
        require: true
    }

});

const CUESTIONARIO = mongoose.model('Cuestionario', cuestionarioSchema);
const PREGUNTAS = mongoose.model('Preguntas', preguntasSchema);

module.exports = {
    CUESTIONARIO,
    PREGUNTAS
}