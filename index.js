'use strict'

const { mongo } = require('mongoose');
var mongoose = require('mongoose'); 
var app = require('./app'); 
var port = 3900; 

mongoose.set('useFindAndModify', false); 
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/dbprueba', { useNewUrlParser: true})
        .then(() => {
            console.log('Conexión a la base de datos ha sido exitosa!!!');
             
            //Crear servidor y escuchar peticiones HTTP 
            app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port); 
            });
            
        });