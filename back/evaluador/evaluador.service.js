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
    // //contenido del if
    if (evaluador.ratio.tipoAlcance == "Nacional") {

        var consultaSql = 'SELECT * FROM v_ficha LIMIT 20';

        // con.connect(function (err) {
        //     if (err) throw err;
        //     console.log("Conectado a poblacion nacional");


        // });
        con.query(consultaSql, function (err, result) {
            if (err) throw err;

            poblacion = result.length;

            console.log("poblacion nacional: ", poblacion);


        });

    } else {

        if (evaluador.ratio.clientes == null) { //cuando no tiene clientes 
            var consultaSql = `SELECT * FROM v_ficha WHERE estado = '${evaluador.ratio.tipoAlcance}' LIMIT 20`;

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

            let clienteSinUbicacion = [],
                clienteConUbicacion = [];

            evaluador.ratio.clientes.forEach(cliente => { //separa a los clientes que tienen ubicacion con los que no.

                if (cliente.ubicacionCliente.length == 0) {

                    clienteConUbicacion.push(cliente);


                } else {
                    clienteSinUbicacion.push(cliente.nombreCliente);
                }

            });

            if (clienteSinUbicacion.length > 0) {
                console.log(evaluador);
                console.log("estoy en cliente sin ubicacion");
                var consultaConCliente = `SELECT * FROM v_ficha WHERE (estado = '${evaluador.ratio.tipoAlcance}' AND (`;

                clienteSinUbicacion.forEach(cliente => { //concardenar consulta para los clientes sin ubicacion

                    consultaConCliente = `${consultaConCliente} cliente = '${cliente}' OR`;

                });
                consultaConCliente = consultaConCliente.substring(0, consultaConCliente.length - 3); //elimina el ultimo OR de la consulta
                consultaConCliente = `${consultaConCliente} ))`; //agrega los parentesis


                //*************************/
                // consultaConCliente = `SELECT * FROM v_ficha WHERE 'estado' = Carabobo AND 'cliente' = CORPORACION AMERICANA DE RESINAS CORAMER C.A`;
                // con.connect(function (err) {
                //     if (err) throw err;
                //     console.log("Conectado a poblacion estadal con clientes sin ubicacion");

                //     con.query(consultaConCliente, function (err, result) {
                //         if (err) throw err;

                //         poblacion = result.length;

                //         console.log(poblacion);

                //         con.end();
                //     });
                // });
                con.query(consultaConCliente, function (err, result) {
                    if (err) throw err;

                    poblacion = result.length;

                    console.log(poblacion);

                });
                console.log("consulta de clientes sin ubicacion", consultaConCliente);

                //***********************//
            }


            if (clienteConUbicacion.length > 0) {
                console.log("estoy en cliente con ubicacion");

                var consultaConUbicacion = `SELECT * FROM v_ficha WHERE (estado = '${evaluador.ratio.tipoAlcance}' AND `;
                // 
                clienteConUbicacion.forEach(cliente => {
                    consultaConUbicacion = `${consultaConUbicacion} (cliente = '${cliente.nombreCliente}' AND (`;

                    cliente.ubicacionCliente.forEach(ubicacion => {
                        consultaConUbicacion = `${consultaConUbicacion} ubicacion = '${ubicacion.nombreUbicacion}' OR`;
                    });
                    consultaConUbicacion = consultaConUbicacion.substring(0, consultaConUbicacion.length - 3); //elimina el ultimo OR de la consulta

                    consultaConUbicacion = `${consultaConUbicacion} ))) AND`; //agrega los parentesis

                });
                consultaConUbicacion = consultaConUbicacion.substring(0, consultaConUbicacion.length - 4); //elimina el ultimo AND de la consulta

                // consultaConCliente = consultaConCliente.split(' AND')[0]; //elimina el ultimo OR de la consulta
                console.log("clientes con ubicacion", consultaConUbicacion);

                //*************************/
                con.connect(function (err) {
                    if (err) throw err;
                    console.log("Conectado a poblacion estadal con clientes con ubicacion");

                    con.query(consultaConUbicacion, function (err, result) {
                        if (err) throw err;

                        poblacion = result.length;

                        console.log(poblacion);

                        con.end();
                    });
                });
                //***********************/
            }

        }
    }

    return (poblacion);
}



async function preguntasPorDia() {
    const evaluadores = await COLLECTION_EVALUADOR.find();

    evaluadores.forEach((evaluador) => {
        const poblacion = determinarPoblacion(evaluador);
        const cantPreguntas = evaluador.pregunta.length;

        const dias = Math.ceil(evaluador.tiempoCuestionario / evaluador.periodicididad);
        const preguntasPorDia = Math.ceil(dias / cantPreguntas);
        const cantEvaluarTiempo = Math.ceil(cantPreguntas / preguntasPorDia);
        const tiempoEvaluarPersona = Math.ceil(dias / cantEvaluarTiempo);
        const personaPorDia = Math.ceil(poblacion / tiempoEvaluarPersona);


        console.log("dias: ", dias);
        console.log("preguntas Por Dia: ", preguntasPorDia);
        console.log("cantEvaluarTiempo: ", cantEvaluarTiempo);
        console.log("tiempoEvaluarPersona: ", tiempoEvaluarPersona);
        console.log("personaPorDia: ", personaPorDia);
    });



}