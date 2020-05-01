// Paquete necesario para conectar a bases de datos MySQL.
var mysql = require('mysql');
// Consulta SQL.
var sql = 'SELECT * FROM v_ficha WHERE `estado` = "carabobo" ';
// var poblacionSql = 'SELECT * FROM ficha LIMIT 10'


// Parámetros de conexión a la base de datos.
var con = mysql.createConnection({
    host: '69.10.42.61',
    user: 'ib_encuestas',
    password: 'Ibarti$$1234',
    database: 'ib_demo',
    port: 5360
});
//
module.exports = con;

// Funcion que nos permite comprobar la conexión a la base de datos.
// con.connect();

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");

//     con.query(sql, function (err, result) {
//         if (err) throw err;

//         //  Bucle que recore los resultados y muestra en consola.
//         for (i = 0; i < result.length; i++) {
//             // console.log("Result: " + result[i].estado);
//         }
//         console.log(result.length);
//         con.end();
//     });
// });




// Funcion que nos devolverá resultados de la base de datos.
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");

//     con.query(poblacionSql, function (err, result) {
//         if (err) throw err;

//         //  Bucle que recore los resultados y muestra en consola.
//         for (i = 0; i < result.length; i++) {
//             console.log("Result: " + result[i].nombres);
//         }
//         console.log(result);
//         con.end();
//     });
// });