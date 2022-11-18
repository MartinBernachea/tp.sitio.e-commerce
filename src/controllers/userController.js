// ************ Require's ************
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const { validationResult } = require('express-validator');


const userFilePath = path.join(__dirname, '../data/usersDataBase.json');
const user = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

const db = require("../database/models")

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

        if (errors.isEmpty()) {
            db.usuario.create({
                "nombre": req.body.cName,
                "apellido": req.body.cLastName,
                "email": req.body.email,
                "contra": bcrypt.hashSync(req.body.password, 10),
                "admin": false,
            })
                .then(resp => res.redirect('/'))
                .catch(err => console.log("err"))
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
                        res.cookie('user', JSON.stringify({ nombre: usuarioALoguearse.nombre, email: usuarioALoguearse.email }), { maxAge: 60000 });
                    }

                    req.session.usuarioLogueado = JSON.stringify({ nombre: usuarioALoguearse.nombre, email: usuarioALoguearse.email });

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