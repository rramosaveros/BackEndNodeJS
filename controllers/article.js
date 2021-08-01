'use strict'

var validator = require('validator'); 
var fs = require('fs'); 
var path = require('path'); 
var articlemodel = require('../models/article'); 
const article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola; 

        return res.status(200).send({ 
            curso: 'Master Frameworks JS',
            autor: 'Lenin Ramos',
            url:'lend.com'
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy acción test de mi controlador de artículos'
        });
    },  

    save: (req, res) => {

        // Catch parameters for post 
        var params = req.body; 

        // Validate data (Validator)
        try{
            var validateTitle = !validator.isEmpty(params.title); 
            var validateContent = !validator.isEmpty(params.content); 
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            }); 
        }     
        
        if(validateTitle && validateContent){
           // Create object to save 
            var article = new articlemodel(); 

           // Assign values 
            article.title = params.title; 
            article.content = params.content; 
            if(params.image){
                article.image = params.image; 
            }else{
                article.image = null; 
            }

            // Save article 
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error', 
                        message: 'El artículo no se ha guardado'
                    });
                }

                // Return a answer 
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos.'
            });
        }
    },

    getArticles: (req, res) => {

        var query = articlemodel.find({});

        var last = req.params.last; 
        if(last || last != undefined){
            query.limit(5); 
        }

        // Find 
        query.sort('-_id').exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los artículos.'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar.' 
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req,res) => {

        // pick up the id of url 
        var articleid = req.params.id; 

        // Check that exist 
        if  (!articleid || !articleid == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artículo.'
            }); 
        }

        // Search article 
        articlemodel.findById(articleid, (err, article) => {
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo.'
                }); 
            }
            // Return in json 
            return res.status(200).send({
                status: 'success',
                article 
            });
        });
    },

    update: (req, res) => {
        // Pick up the article id for url 
        var articleid = req.params.id; 

        // Pick up data that are arribing for put 
        var params = req.body; 

        // Validate data 
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            });
        }

        if (validate_title && validate_content){
            // Find and update 
            articlemodel.findOneAndUpdate({_id: articleid}, params, {new:true}, (err, articleupdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar.'
                    });
                } 
                if(!articleupdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el artículo.'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleupdated
                });
            });
        }else{
            // Return answer
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta.'
            });
        }
    }, 
    
    delete: (req, res) => {
        // Pick up the id of url 
        var articleid = req.params.id; 

        //Find and delete 
        articlemodel.findOneAndDelete({_id: articleid}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar.'
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error', 
                    message: 'No se ha borrado el artículo, posiblemente no exista.'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    }, 

    upload: (req, res) => {
        // Config module connect multiparty router/article.js 


        // Pick up the file of position 
        var file_name = 'Imagen no subida'; 
       
        if(!req.files){
            return res.status(404).send({
                status: 'error', 
                message: file_name
            });
        }

        // Get name and the file extension 
        var file_path = req.files.file0.path; 
        var file_split = file_path.split('\\'); 
        // * Warning in Linux or MAC 
        // var file_split = file_path.split('/'); 

        // File name 
        var file_name = file_split[2]; 

        // File extension 
        var extension_split = file_name.split('\.'); 
        var file_ext = extension_split[1]; 

        // Check the extension, only images, if is validates delete the file 
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error', 
                    message: 'La  extensión de la imagen no es válida. '
                });
            });
        }else{
            // If all is validate, get id of the url 
            var articleid = req.params.id; 
            
            if(articleid){
                // Search the article, assign the image name and update it 
                articlemodel.findOneAndUpdate({_id: articleid}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del artículo. '
                        });
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }
        }
    },

    getImage: (req, res) => {
        var file = req.params.image; 
        var path_file = './upload/articles/'+file; 
        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file)); 
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe. ' 
                }); 
            }
        })
    },

    search: (req, res) => {
        // Get the string to search 
        var searchString = req.params.search; 
        
        //Find or 
        articlemodel.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i" }},
            { "content": { "$regex": searchString, "$options": "i" }}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles)=> {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición.'
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos que coincidad con tu búsqueda.'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                articles 
            });
        });
    }

}; //end controller

module.exports = controller; 
