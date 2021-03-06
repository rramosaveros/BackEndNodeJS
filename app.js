'use strict'

// Cargar módulos de node para crear el servidor
var express = require('express'); 
var bodyParser = require('body-parser'); 

// Ejecutar express (http) 
var app = express(); 

// Cargar ficheros rutas 
var articleRoutes = require('./routes/article'); 

// Middlewares
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); 

// CORS 
// Configurar cabeceras y cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Añadir prefijos a rutas / Cargar rutas
app.use('/api', articleRoutes); 
 
// Exportar el módulo (fichero actual) 
module.exports = app; 