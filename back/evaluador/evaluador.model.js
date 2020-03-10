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
    position: {
        type: String,
        required: true
    },
    ratio: {
        type: String,
        default: 'N/A'
    },
    type: {
        type: String,
        required: true
    }
});

const EVALUADOR = mongoose.model('Evaluador', evaluadorSchema);

module.exports = {
    EVALUADOR
}