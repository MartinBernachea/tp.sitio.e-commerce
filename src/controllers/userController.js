// ************ Require's ************
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const { validationResult } = require('express-validator');


const userFilePath = path.join(__dirname, '../data/usersDataBase.json');
const user = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));


const controller = {
    login: (req, res) => {
        if (req.cookies.user != undefined) {

            res.render('./pages/logueado', { user: JSON.parse(req.cookies.user) })
        }
        else if (req.session.usuarioLogueado != undefined) {
            res.render('./pages/logueado', { user: JSON.parse(req.session.usuarioLogueado) })
        }
        else res.render('./pages/formLogin', { user: user });
    },
    register: (req, res) => {
        res.render('./pages/formRegister');
    },
    userStore: (req, res, next) => {
        let errors = validationResult(req);

        let idNuevoUsuario = (user[user.length - 1].id) + 1;

        if (errors.isEmpty()) {
            let nuevoUsuario = {
                "id": idNuevoUsuario,
                "nombre": req.body.cName,
                "email": req.body.email,
                "password": bcrypt.hashSync(req.body.password, 10)
            }
            user.push(nuevoUsuario);

            fs.writeFileSync(userFilePath, JSON.stringify(user, null, ' '), 'utf-8');

            res.redirect('/');
        } else {
            res.render('./pages/formRegister', {
                errors: errors.array(),
                old: req.body,
            });
        }


    },
    processLogin: (req, res) => {
        let errors = validationResult(req);
        let archivoUsuario = fs.readFileSync(userFilePath, {
            encoding: 'utf-8'
        });
        let usuarios = JSON.parse(archivoUsuario);
        let usuarioALoguearse;

        if (errors.isEmpty()) {

            for (let i = 0; i < usuarios.length; i++) {

                if (usuarios[i].email == req.body.email) {
                    usuarioALoguearse = usuarios[i];
                }
            }

            if (usuarioALoguearse != undefined) {

                if (bcrypt.compareSync(req.body.password, usuarioALoguearse.password) == true) {

                    if (req.body.mantenerSesion == 'on') {
                        res.cookie('user', JSON.stringify({ nombre: usuarioALoguearse.nombre , email: usuarioALoguearse.email }) , { maxAge: 60000 } );
                    }

                    req.session.usuarioLogueado = JSON.stringify({ nombre: usuarioALoguearse.nombre , email: usuarioALoguearse.email });

                    console.log(req.body.mantenerSesion);
                    res.redirect('/');

                } else {
                    res.send('password incorrecto');
                }
            } else {
                res.send('email invalido')
            }

        } else {
            res.render('./pages/formLogin', {
                errors: errors.array(),
                old: req.body,
            });
        }
    },
    logOut: (req, res) => {
        
        res.clearCookie("user");// destroy the cookie

        req.session.destroy((err) => {
            res.redirect('/');
        }) // destroy all sessions

    }
};
module.exports = controller;