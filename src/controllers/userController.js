// ************ Require's ************
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const { validationResult } = require('express-validator');

const db = require("../database/models");
const { customValidationErrorMsg } = require("../utils/validations");

const controller = {
    login: (req, res) => {
        res.render('./pages/formLogin')
    },
    register: (req, res) => {
        res.render('./pages/formRegister');
    },
    userStore: async (req, res, next) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            try {
                const usersWithSameEmail = await db.usuario.findAll({ where: { email: req.body.email } })
                const arrCustomErrors = [];

                /* Existe usuario con el mismo mail? */
                if (usersWithSameEmail.length != 0) arrCustomErrors.push(customValidationErrorMsg.existentMail);

                /* Coinciden las contraseñas ingresadas en form? */
                if (req.body.password != req.body.cPassword) arrCustomErrors.push(customValidationErrorMsg.notMatchPass);

                if (arrCustomErrors.length > 0) {
                    return res.render('./pages/formRegister', {
                        arrCustomErrors: arrCustomErrors,
                        old: req.body,
                    });
                }

                await db.usuario.create({
                    "nombre": req.body.cName,
                    "apellido": req.body.cLastName,
                    "email": req.body.email,
                    "password": bcrypt.hashSync(req.body.password, 10),
                    "admin": false,
                    "super": false,
                })

                res.redirect('/')
            } catch (err) {
                console.log("err")
            }
        } else {
            res.render('./pages/formRegister', {
                errors: errors.array(),
                old: req.body,
            });
        }


    },
    processLogin: async (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const userData = await db.usuario.findOne({ where: { email: req.body.email } })
            const frontUserData = {
                nombre: userData.nombre,
                email: userData.email,
                admin: userData.admin,
                super: userData.super,
            };

            if (!userData) {
                return res.send('email invalido')
            }

            if (!bcrypt.compareSync(req.body.password, userData.password)) {
                return res.send('password incorrecto');
            }

            if (req.body.mantenerSesion == 'on') {
                res.cookie('user', JSON.stringify(frontUserData), { maxAge: 60000 });
            }

            req.session.usuarioLogueado = JSON.stringify(frontUserData);

            res.redirect('/');
        } else {
            res.render('./pages/formLogin', {
                errors: errors.array(),
                old: req.body,
            });
        }
    },
    account: (req, res) => {
        if (req.cookies.user) {
            res.render('./pages/logueado', { user: JSON.parse(req.cookies.user) })
        } else {
            res.render('./pages/logueado', { user: JSON.parse(req.session.usuarioLogueado) })
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