config = require('config.json');
const DB = require('_helpers/db');
const COLLECTION_EVALUADOR = DB.Evaluador;

var con = require("../config/DbConnectionsMysql");
//*******************

//********************
module.exports = {
    getAllEvaluador,
    getEvaluador,
    addEvaluador,
    editEvaluador,
    deleteEvaluador,
    preguntasPorDia,
    determinarPoblacion
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

async function determinarPoblacion(evaluador) {
    var poblacion;
    //evaluador.ratio.tipoAlcance == "Nacional" //contenido del if
    if (false) {

        var consultaSql = 'SELECT * FROM v_ficha LIMIT 20';

        con.connect(function (err) {
            if (err) throw err;
            console.log("Conectado a poblacion nacional");

            con.query(consultaSql, function (err, result) {
                if (err) throw err;

                poblacion = result.length;

                console.log(poblacion);

                con.end();
            });
        });

    } else {
        // evaluador.ratio.clientes == null //contenido del if
        if (false) { //cuando no tiene clientes 
            var consultaSql = `SELECT * FROM v_ficha WHERE 'estado' = ${evaluador.ratio.tipoAlcance} LIMIT 20`;

            con.connect(function (err) {
                if (err) throw err;
                console.log("Conectado a poblacion estadal");

                con.query(consultaSql, function (err, result) {
                    if (err) throw err;

                    poblacion = result.length;

                    console.log(poblacion);

                    con.end();
                });
            });

        } else {
            // const clienteConUbicacion = ['cliente1', 'cliente2', 'cliente3', 'cliente4'],
            // clienteSinUbicacion = ['cliente4', 'cliente3', 'cliente2', 'cliente1'];


            // evaluador.ratio.clientes.forEach(cliente => { //separa a los clientes que tienen ubicacion con los que no.

            //     if (cliente.ubicacionCliente.length == 0) {

            //         clienteConUbicacion.push(cliente);


            //     } else {
            //         clienteSinUbicacion.push(cliente.nombreCliente);
            //     }

            // });
            const clienteSinUbicacion = [{
                    nombreCliente: "cocacola"
                },
                {
                    nombreCliente: "pdvsa"
                },
                {
                    nombreCliente: "oesvica"
                }
            ];

            if (clienteSinUbicacion.length > 0) {
                var consultaConCliente = `SELECT * FROM v_ficha WHERE ('estado' = carabobo AND (`;
                //'estado' = ${evaluador.ratio.tipoAlcance}
                clienteSinUbicacion.forEach(cliente => { //concardenar consulta para los clientes sin ubicacion
                    consultaConCliente = `${consultaConCliente} 'cliente' = ${cliente.nombreCliente} OR`;

                });
                consultaConCliente = consultaConCliente.substring(0, consultaConCliente.length - 3); //elimina el ultimo OR de la consulta
                consultaConCliente = `${consultaConCliente} ))`; //agrega los parentesis
                console.log("clientes sin ubicacion", consultaConCliente);

            }


            const clienteConUbicacion = [{
                    nombreCliente: "cocacola",
                    ubicacionCliente: [{
                            nombreUbicacion: "ubicacion1"
                        },
                        {
                            nombreUbicacion: "ubicacion123"
                        }
                    ]
                },
                {
                    nombreCliente: "pdvsa",
                    ubicacionCliente: [{
                            nombreUbicacion: "ubicacion2"
                        },
                        {
                            nombreUbicacion: "ubicacion234"
                        }
                    ]
                },
                {
                    nombreCliente: "oesvica",
                    ubicacionCliente: [{
                        nombreUbicacion: "ubicacion3"
                    }]
                }
            ];

            if (clienteConUbicacion.length > 0) {
                var consultaConUbicacion = `SELECT * FROM v_ficha WHERE ('estado' = carabobo  AND `;
                // ${evaluador.ratio.tipoAlcance}
                clienteConUbicacion.forEach(cliente => {
                    consultaConUbicacion = `${consultaConUbicacion} ('cliente' = ${cliente.nombreCliente} AND (`;

                    cliente.ubicacionCliente.forEach(ubicacion => {
                        consultaConUbicacion = `${consultaConUbicacion} 'ubicacion' = ${ubicacion.nombreUbicacion} OR`;
                    });
                    consultaConUbicacion = consultaConUbicacion.substring(0, consultaConUbicacion.length - 3); //elimina el ultimo OR de la consulta

                    consultaConUbicacion = `${consultaConUbicacion} ))) AND`; //agrega los parentesis

                });
                consultaConUbicacion = consultaConUbicacion.substring(0, consultaConUbicacion.length - 4); //elimina el ultimo AND de la consulta

                // consultaConCliente = consultaConCliente.split(' AND')[0]; //elimina el ultimo OR de la consulta
                console.log("clientes con ubicacion", consultaConUbicacion);

            }

        }
    }


}



async function preguntasPorDia() {
    const evaluadores = await COLLECTION_EVALUADOR.find();

    evaluadores.forEach((evaluador) => {
        const dias = Math.ceil(evaluador.tiempoCuestionario / evaluador.periodicididad);
        const preguntasPorDia = Math.ceil(dias / cantPreguntas);
        const cantEvaluarTiempo = Math.ceil(cantPreguntas / preguntasPorDia);
        const tiempoEvaluarPersona = Math.ceil(dias / cantEvaluarTiempo);
        const personaPorDia = math.ceil(poblacion / tiempoEvaluarPersona);
    });
}