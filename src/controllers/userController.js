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
        const resultsPerPage = 10;
        const userData = getUserDataStringified(req);
        const formData = req.query;

        let localsParams = { userData, formData }

        if (req.session.notificationAlert) {
            localsParams.notificationAlert = req.session.notificationAlert;
            req.session.notificationAlert = null
        }

        const wasFormSent = Object.values(formData).length > 0;
        const isFormEmpty = Object.values(formData).every(ctValue => {
            return ctValue.trim() ? ctValue.trim() : ctValue
        });

        if (wasFormSent) {
            const currentPage = formData.page ?? 1;
            let queryFilters = {
                limit: resultsPerPage,
                offset: resultsPerPage * (currentPage - 1),
                attributes: ['id', 'nombre', 'apellido', "email", "admin", "super", "restringido"]
            }

            let formFilters;

            if (!isFormEmpty) {
                let filters = {}
                const Op = db.Sequelize.Op;
                if (formData.userName) filters["nombre"] = { [Op.like]: `%${formData.userName}%` }
                if (formData.userLastname) filters["apellido"] = { [Op.like]: `%${formData.userLastname}%` }
                if (formData.userEmail) filters["email"] = { [Op.like]: `%${formData.userEmail}%` }
                if (formData.userRole) {
                    if (formData.userRole == "1") {
                        filters["admin"] = false
                        filters["super"] = false
                    }
                    if (formData.userRole == "2") filters["admin"] = true
                    if (formData.userRole == "3") filters["super"] = true
                }
                if (formData.userRestringido) {
                    if (formData.userRestringido == "1") filters["restringido"] = true
                    if (formData.userRestringido == "2") filters["super"] = false
                }
                formFilters = { where: filters };
                queryFilters["where"] = filters;
            }

            const allElements = await db.usuario.findAll(formFilters)
            const elements = await db.usuario.findAll(queryFilters)

            console.log("elements", elements)

            localsParams["usersResults"] = {
                elements,
                quantity: allElements.length,
                page: currentPage,
                resultsPerPage,
            }
        }

        res.render('./pages/usersPanel', localsParams);
    },
    editUser: async (req, res) => {
        console.log("ENTRAMOS")
        const newData = {
            nombre: req.body.cName,
            apellido: req.body.cLastName,
            email: req.body.email,
            admin: req.body.admin == "SI",
            super: req.body.super == "SI",
            restringido: req.body.restringido == "SI",
        }

        console.log("newData", newData)
        try {
            const resp = await db.usuario.update(newData, { where: { id: req.params.id } });
            console.log("resp", resp)
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                title: "Usuario editado correctamente",
            }
            res.status(200).json({ status: 200, message: "OK" })

        } catch (err) {
            console.log("err", err)
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Bien! ",
                title: "Usuario editado correctamente",
            }
            res.status(200).json({ status: 200, message: "OK" })
        }
    }

};
module.exports = controller;