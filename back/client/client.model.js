var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientesSchema = new Schema({
	descripcion: {
		type: String,
		require: false
	},
	identificacion: {
		type: String,
		requiere: false
	},
	direccion: {
		type: String,
		require: false
	},
	telefono: {
		type: String,
		require: false
	},
	representante: {
		type: String,
		require: false
	},
	telefono_representante: {
		type: String,
		require: false
	},
	status: {
		type: Boolean,
		default: true
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	ubicaciones: [{
		type: Schema.Types.ObjectId,
		ref: "Ubicacion"
	}]
});

var ubicacionSchema = new Schema({
	descripcion: {
		type: String,
		require: false
	},
	direccion: {
		type: String,
		require: false
	},
	status: {
		type: Boolean,
		require: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	cargos: [{
		cargo: {
			type: Schema.Types.ObjectId,
			ref: "Cargos"
		},
		roles: [{
			roll: {
				type: Schema.Types.ObjectId,
				ref: "Roll"
			},
			turnos: [{
				turno: {
					type: Schema.Types.ObjectId,
					ref: "Turnos"
				},
				value: { type: Number, default: 0 }
			}]

		}]
	}],
	cliente: {
		type: Schema.Types.ObjectId,
		ref: 'Clientes'
	},
	estado:{
		type: Schema.Types.ObjectId,
		ref: 'Estados'
	},
	conceptos: [{
		type: Schema.Types.ObjectId,
		ref: 'Conceptos'
	}]
});

var cargosSchema = new Schema({
	descripcion: {
		type: String,
		require: false
	},
	status: {
		type: Boolean,
		require: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

var rollSchema = new Schema({
	descripcion: {
		type: String,
		require: false
	},
	status: {
		type: Boolean,
		require: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	conceptos: [{
		type: Schema.Types.ObjectId,
		ref: 'Conceptos'
	}]
});

var turnollSchema = new Schema({
	descripcion: {
		type: String,
		require: false
	},
	status: {
		type: Boolean,
		require: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	conceptos: [{
		type: Schema.Types.ObjectId,
		ref: 'Conceptos'
	}]
});

var estadoSchema = new Schema({
	nombre:{
		type:String,
		required:true
	},
	descripcion:{
		type:String,
		required:true
	},
	centroCosto:{
		type:Schema.Types.ObjectId,
		ref:'centroCostos',
		default:null
	},
	geoLocalizacion:{
		alt:{
			type:String,
			default:null
		},
		lng:{
			type:String,
			default:null
		}
	}
	,
	createdDate:{
		type:Date,
		default:Date.now()
	}
});


clientesSchema.set('toJSON', {
	virtuals: true
});
ubicacionSchema.set('toJSON', {
	virtuals: true
});
cargosSchema.set('toJSON', {
	virtuals: true
});
rollSchema.set('toJSON', {
	virtuals: true
});
turnollSchema.set('toJSON', {
	virtuals: true
});

estadoSchema.set('toJSON', {
	virtuals: true
});

const Clientes = mongoose.model('Clientes', clientesSchema);
const Ubicacion = mongoose.model('Ubicacion', ubicacionSchema);
const Cargos = mongoose.model('Cargos', cargosSchema);
const Roll = mongoose.model('Roll', rollSchema);
const Turnos = mongoose.model('Turnos', turnollSchema);
const Estados = mongoose.model('Estado', estadoSchema);


module.exports = {
	Clientes,
	Ubicacion,
	Cargos,
	Roll,
	Turnos,
	Estados
};
