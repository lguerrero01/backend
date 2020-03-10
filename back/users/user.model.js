/*jslint(unexpected_space_a_b)*/
/*jshint esversion: 9*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
	descripcion: String,
	cantidad: Number,
	valor: Number,
	unidad: {
		type: String,
		default: ''
	},
	idGroup: {
		type: Schema.Types.ObjectId,
		ref: 'GroupItems'
	},
	idFather: String, // ID del Usuario que creo el Item
	createdDate: {
		type: Date,
		default: Date.now()
	}
});

var groupItemsShecma = new Schema({
	descripcion: String,
	// items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
	idFather: String,
	createdDate: {
		type: Date,
		default: Date.now()
	}
});

var categoriaSchema = new Schema({
	_id: Schema.Types.ObjectId,
	descripcion: {
		type: String,
		requiere: false
	},
	// subcategorias: [{ type: Schema.Types.ObjectId, ref: 'Subcategoria' }] // referencia a las Subcategoría para esta Categoria
	createdDate: {
		type: Date,
		default: Date.now()
	}
});

var subcategoriaSchema = new Schema({
	descripcion: {
		type: String,
		requiere: false
	},
	// conceptos: [{ type: Schema.Types.ObjectId, ref: 'Conceptos' }], // referencia a los conceptos que pertenecen a esta sub categoría
	idFather: {
		type: Schema.Types.ObjectId,
		ref: 'Categoria'
	}, // Id de la categoría a la que pertenece
	createdDate: {
		type: Date,
		default: Date.now()
	}
});

var conceptosSchema = new Schema({
	descripcion: {
		type: String,
		require: false
	},
	tipo: {
		type: String,
		requiere: false
	},
	valor: {
		Directo: {
			type: Number,
			default: 0
		},
		Dato: {
			type: Number,
			default: 0
		},
		Formula: {
			type: Array,
			default: []
		},
		Compuesto: {
			items: [{
				type: Schema.Types.ObjectId,
				ref: 'Item'
			}],
			check: Array
		}
	},
	representacion: {
		type: String
	},
	idFather: {
		type: String,
		require: false
	}, // Id del usuario que creó el concepto
	idSub: {
		type: Schema.Types.ObjectId,
		ref: 'Subcategoria'
	}, // Id de la Subcategoria a la que pertenece este Concepto
	idCat: {
		type: Schema.Types.ObjectId,
		ref: 'Categoria'
	}, // Id de la Categoría a la que pertenece este concepto
	cuentas: [{
		type: Schema.Types.ObjectId,
		ref: 'Cuentas',
		default: []
	}],
	createdDate: {
		type: Date,
		default: Date.now()
	},
	status: {
		type: Boolean,
		default: true
	},
	descriptionText: {
		type: String,
		default: ''
	},
	constant: {
		type: Boolean,
	},
	primary: {
		type: Boolean
	}
});


var menuDSchema = new Schema({
	name: {
		type: String,
		require: false,
		default: 'null'
	},
	Create: {
		type: Boolean,
		required: false,
		default: false
	},
	Read: {
		type: Boolean,
		required: false,
		default: false
	},
	Update: {
		type: Boolean,
		required: false,
		default: false
	},
	Delete: {
		type: Boolean,
		required: false,
		default: false
	},
	idFather: {
		type: String,
		require: false,
		default: 'null'
	}, // Id del Módulo al que pertenece el menú
	createdDate: {
		type: Date,
		default: Date.now()
	}
});


var moduleSchema = new Schema({
	Concepto: {
		hasPermissionThisModule: {
			type: Boolean,
			require: false,
			default: false
		},
		accessToMenus: {
			type: Array,
			require: false,
			default: []
		}
	},
	Administracion: {
		hasPermissionThisModule: {
			type: Boolean,
			require: false,
			default: false
		},
		accessToMenus: {
			type: Array,
			require: false,
			default: []
		}
	},
	Cargo: {
		hasPermissionThisModule: {
			type: Boolean,
			require: false,
			default: false
		},
		accessToMenus: {
			type: Array,
			require: false,
			default: []
		}
	},
	Cliente: {
		hasPermissionThisModule: {
			type: Boolean,
			require: false,
			default: false
		},
		accessToMenus: {
			type: Array,
			require: false,
			default: []
		}
	},
	Reporte: {
		hasPermissionThisModule: {
			type: Boolean,
			require: false,
			default: false
		},
		accessToMenus: {
			type: Array,
			require: false,
			default: []
		}
	},
	idFather: {
		type: String,
		required: false,
		default: 'null'
	}, // Id del usuario al que pertenece este Conjunto de módulos
	createdDate: {
		type: Date,
		default: Date.now()
	}
});

// Esquema Mongoose para un Usuario que se enviará a la base de datos Mongo

var userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	hash: {
		type: String,
		rerquired: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	createdDate: {
		type: Date,
		default: Date.now()
	},
	loggedIn: {
		type: Boolean,
		required: false,
		default: false
	},
	accesToken: {
		type: String,
		required: false,
		default: 'null'
	},
	rol: {
		type: String,
		required: false,
		default: 'user'
	},
	hasPermissionToModules: {
		type: Boolean,
		require: false,
		default: true
	},
	accessToModules: {
		type: String,
		required: false,
		default: 'null'
	}
});

itemSchema.set('toJson', {
	virtuals: true
});
groupItemsShecma.set('toJson', {
	virtuals: true
});
categoriaSchema.set('toJSON', {
	virtuals: true
});
subcategoriaSchema.set('toJSON', {
	virtuals: true
});
conceptosSchema.set('toJSON', {
	virtuals: true
});
menuDSchema.set('toJSON', {
	virtuals: true
});
moduleSchema.set('toJSON', {
	virtuals: true
});
userSchema.set('toJSON', {
	virtuals: true
});

const Item = mongoose.model('Item', itemSchema);
const GroupItems = mongoose.model('GroupItems', groupItemsShecma);
const Categoria = mongoose.model('Categoria', categoriaSchema);
const Subcategoria = mongoose.model('Subcategoria', subcategoriaSchema);
const Conceptos = mongoose.model('Conceptos', conceptosSchema);
const Access = mongoose.model('Access', moduleSchema);
const MenuD = mongoose.model('MenuD', menuDSchema);
const User = mongoose.model('User', userSchema);


module.exports = {
	Item,
	GroupItems,
	Categoria,
	Subcategoria,
	Conceptos,
	Access,
	MenuD,
	User
};
