config = require('config.json');
const DB = require('_helpers/db');
const COLLECTION_EVALUADOR = DB.Evaluador;

// var con = require("../config/DbConnectionsMysql");
//*******************

//********************
module.exports = {
    getAllEvaluador,
    getEvaluador,
    addEvaluador,
    editEvaluador,
    deleteEvaluador,
    preguntasPorDia,
    determinarPoblacion,
    prueba,
    preguntasAleatorias,
    repetirPreguntas
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

        var pool = await _execute(consultaSql);
        poblacion = pool.length;
        console.log("67 poblacion nacional: ", poblacion);


    } else {

        if (evaluador.ratio.clientes == null) { //cuando no tiene clientes 
            var consultaSql = `SELECT * FROM v_ficha WHERE cod_estado = '${evaluador.ratio.tipoAlcance}' LIMIT 20`;

            console.log("(79)Conectado a poblacion estadal sin clientes");

            var pool = await _execute(consultaSql);
            poblacion = pool.length;

            console.log("linea 95 poblacion estadal: ", poblacion);


        } else {

            let clienteSinUbicacion = [],
                clienteConUbicacion = [];

            evaluador.ratio.clientes.forEach(cliente => { //separa a los clientes que tienen ubicacion con los que no.

                if (cliente.ubicacionCliente.length > 0) {

                    clienteConUbicacion.push(cliente);


                } else {
                    clienteSinUbicacion.push(cliente.nombreCliente);
                }

            });

            if (clienteSinUbicacion.length > 0) {
                console.log(evaluador);
                console.log("(103) estoy en cliente sin ubicacion \n");
                var consultaConCliente = `SELECT * FROM v_ficha WHERE (cod_estado = '${evaluador.ratio.tipoAlcance}' AND (`;

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

                var pool = await _execute(consultaConCliente);
                poblacion = pool.length;

                console.log("consulta de clientes sin ubicacion", consultaConCliente);

                //***********************//
            }


            if (clienteConUbicacion.length > 0) {
                console.log("estoy en cliente con ubicacion");

                var consultaConUbicacion = `SELECT * FROM v_ficha WHERE (cod_estado = '${evaluador.ratio.tipoAlcance}' AND `;
                // 
                clienteConUbicacion.forEach(cliente => {
                    consultaConUbicacion = `${consultaConUbicacion} (cliente = '${cliente.nombreCliente}' AND (`;

                    cliente.ubicacionCliente.forEach(ubicacion => {
                        consultaConUbicacion = `${consultaConUbicacion} cod_ubicacion = '${ubicacion.nombreUbicacion}' OR`;
                    });
                    consultaConUbicacion = consultaConUbicacion.substring(0, consultaConUbicacion.length - 3); //elimina el ultimo OR de la consulta

                    consultaConUbicacion = `${consultaConUbicacion} ))) AND`; //agrega los parentesis

                });
                consultaConUbicacion = consultaConUbicacion.substring(0, consultaConUbicacion.length - 4); //elimina el ultimo AND de la consulta

                // consultaConCliente = consultaConCliente.split(' AND')[0]; //elimina el ultimo OR de la consulta
                console.log("(160)clientes con ubicacion", consultaConUbicacion);

                //*************************/

                console.log("(164)Conectado a poblacion estadal con clientes con ubicacion");


                var pool = await _execute(consultaConUbicacion);
                poblacion = pool.length;
                // console.log("(169)poblacion: ", poblacion);



                //***********************/
            }

        }
    }

    return (poblacion);
}



async function preguntasPorDia() {
    const evaluadores = await COLLECTION_EVALUADOR.find();

    // const evaluador = evaluadores[0];

    evaluadores.forEach(async (evaluador, index) => {
        const poblacion = await determinarPoblacion(evaluador);
        const cantPreguntas = evaluador.pregunta.length;



        const tiempoEstimadoParaCuestionario = Math.ceil(evaluador.tiempoCuestionario / evaluador.periodicidad);
        const preguntasPorDia = Math.floor(tiempoEstimadoParaCuestionario / cantPreguntas);
        const cantidadPersonasEvaluarPorDia = Math.ceil(poblacion / preguntasPorDia);


        console.log("\nevaluador numero: ", index, evaluador._id);
        console.log("(192) console log de tiempo cuestionario: ", evaluador.tiempoCuestionario); //dias laborables del año
        console.log("(193) console log de periodicidad: ", evaluador.periodicidad, "\n"); // cada cuanto se repetira el cuestionario
        console.log(cantPreguntas, " preguntas a ", poblacion, " personas en ", tiempoEstimadoParaCuestionario, " dias");
        console.log(preguntasPorDia, " dias para hacer 1 pregunta a cada persona");
        console.log(cantidadPersonasEvaluarPorDia, " personas a evaluar por dia");
    });


}


async function _execute(_query) { //funcion que ejecuta queries
    var con = require("../config/DbConnectionsMysql");

    try {
        var rows = await con.query(_query);
        return rows;
    } catch (error) {
        throw new Error(error);
    }
}

async function prueba() {
    var consultaSql = 'SELECT * FROM v_ficha LIMIT 20';
    var pool = await _execute(consultaSql);

    console.log("(256) pool: ", pool);

    console.log("(254) hola esto es una prueba ");
}

async function preguntasAleatorias(preguntas = ["12", "23", "34", "45", "555"], preguntasHechas = ["34", "45"]) {

    var preguntasPorHacer = [];

    preguntas.forEach(pregunta => {
        var repetido = false;
        preguntasHechas.forEach(preguntaHecha => {
            if (pregunta === preguntaHecha) {
                repetido = true;
                return;
            }
        });
        if (!repetido) {
            preguntasPorHacer.push(pregunta);
        }
    });

    var indiceAleatorio = Math.floor(Math.random() * preguntasPorHacer.length);

    console.log("indice aleatorio: ", indiceAleatorio);

    console.log("\n pregunta: ", preguntasPorHacer[indiceAleatorio]);

}

//funcion que eliga personas a evaluar aleatoriamente

async function repetirPreguntas(f1 = '10/09/2014', f2 = '15/10/2014') { //resta las fechas para hacer las siguentes preguntas a todas las personas a evaluar

    var aFecha1 = f1.split('/');
    var aFecha2 = f2.split('/');
    var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

    console.log(dias);
}