// ************ Require's ************
const bcrypt = require ('bcrypt');
const path = require ('path');
const fs = require ('fs');
const multer = require ('multer');
const session = require('express-session');
const { validationResult } = require ('express-validator');


const userFilePath = path.join(__dirname, '../data/usersDataBase.json');
const user = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));


const controller = {
    login: (req, res) => {
        res.render('./pages/formLogin', {user: user});
    },
    register: (req, res) => {
        res.render('./pages/formRegister');
    },
    userStore: (req, res, next) => {
        let errors = validationResult(req);

        let idNuevoUsuario = (user[user.length - 1].id) + 1;
        
        if(errors.isEmpty()){
        let nuevoUsuario = {
            "id": idNuevoUsuario,
            "nombre": req.body.cName,
            "email": req.body.email,
            "password": bcrypt.hashSync(req.body.password, 10)
            // "image": 
        }
        user.push(nuevoUsuario);

        fs.writeFileSync(userFilePath, JSON.stringify(user, null, ' '), 'utf-8');

        res.redirect('/');
    } else {
        res.render('./pages/formRegister', {errors: errors.array() } );
    }
        

    },
    processLogin: (req, res) => {
        let errors = validationResult(req);
        let archivoUsuario = fs.readFileSync(userFilePath, {encoding: 'utf-8'}); 
        let usuarios;

        if (errors.isEmpty()){

            if (archivoUsuario == " "){
                usuarios = [];
                
            } else {
                usuarios = JSON.parse(archivoUsuario);
                
                for (let i=0; i<= usuarios.length; i++){
                    if(req.body.email == usuarios[i].email && bcrypt.compareSync(req.body.password, usuarios[i].password));
                    
                    res.redirect('/');
                    
                }
            }
        } else {
            res.render('./pages/formLogin', {errors: errors.array() } ); 
        }
    }
};
module.exports = controller;