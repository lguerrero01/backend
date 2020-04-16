// Paquete necesario para conectar a bases de datos MySQL.
var mysql = require('mysql');
// Consulta SQL.
var sql = 'SELECT * FROM actualizar LIMIT 10';
var poblacionSql = 'SELECT * FROM _ficha'
// Parámetros de conexión a la base de datos.
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ib_ibarti'
});

// Funcion que nos permite comprobar la conexión a la base de datos.
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// Funcion que nos devolverá resultados de la base de datos.
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
        if (err) throw err;

        // Bucle que recore los resultados y muestra en consola.
        // for (i = 0; i < result.length; i++) {
        //     console.log("Result: " + result[i].descripcion);
        // }
        console.log(result);
        con.end();
    });
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    
    con.query( poblacionSql, function (err, result) {
        if (err) throw err;

         Bucle que recore los resultados y muestra en consola.
         for (i = 0; i < result.length; i++) {
             console.log("Result: " + result[i].descripcion);
         }
        console.log(result);
        con.end();
    });
});