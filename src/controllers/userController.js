// ************ Require's ************
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const { validationResult } = require('express-validator');

const db = require("../database/models");

const { customValidationErrorMsg } = require("../utils/validations");
const { getUserDataStringified } = require('../utils/userData');

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
        const userData = getUserDataStringified(req);
        res.render('./pages/logueado', { userData })
    },
    logOut: (req, res) => {

        res.clearCookie("user");// destroy the cookie

        req.session.destroy((err) => {
            res.redirect('/');
        }) // destroy all sessions

    },
    panel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const formData = req.query;
        const wasFormSent = Object.values(formData).length > 0;
        const isFormEmpty = Object.values(formData).every(ctValue => ctValue.trim() == "");
        const currentPage = formData.page ?? 1;
        let queryFilters = {
            limit: 10,
            offset: 10 * (currentPage - 1)
        }

        if (!isFormEmpty) {
            let formFilters = {}
            const Op = db.Sequelize.Op;
            if (formData.userName) formFilters["nombre"] = {[Op.like]: `%${formData.userName}%`}
            if (formData.userLastname) formFilters["apellido"] = {[Op.like]: `%${formData.userLastname}%`}
            if (formData.userEmail) formFilters["email"] = {[Op.like]: `%${formData.userEmail}%`}
            if (formData.userRole) {
                if (formData.userRole == "2") formFilters["admin"] = true
                if (formData.userRole == "3") formFilters["super"] = true
            }

            queryFilters["where"] = formFilters;
        }
        
        const usersList = wasFormSent ? await db.usuario.findAll(queryFilters) : null
        res.render('./pages/usersPanel', { userData, usersList, formData });
    }
};
module.exports = controller;