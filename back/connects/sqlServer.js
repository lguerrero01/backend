const sql = require("mssql");
const configConnect = require("./configConnect");
var sqlServer = class sqlServer extends configConnect {
	constructor(user, password, server, database) {
		super(user, password, server, database);
		console.log("construido");
	}

	async desconectar() {
		await sql.close(this.conexion);
		console.log("desconectado");
	}

	async query(query) {
		let resp = null;
		this.conexion.parseJSON = true;
		try {
			resp = await new sql.Request(this.conexion).query(query);
		} catch (error) {
			console.log(error);
		}

		if (resp && resp.recordset) {
			return resp.recordset;
		}
	}

	async conectar() {
		console.log("conectando");
		this.conexion = await sql.connect({
			user: this.user,
			password: this.password,
			server: this.server,
			database: this.database
		});
		console.log("conectado");
		sql.on("error", err => {
			if(err){
				return false;
			}
		});
	}
};

module.exports = sqlServer;
