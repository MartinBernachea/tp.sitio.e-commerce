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
const { getNotificationAlert } = require('../utils/notificationAlert');
const { getAppConfig } = require("../utils/appConfig")

const controller = {
    login: async (req, res) => {
        const appConfig = await getAppConfig();
        localsParams = { appConfig }

        res.render('./pages/formLogin', localsParams)
    },
    register: async (req, res) => {
        const appConfig = await getAppConfig();
        localsParams = { appConfig }
        res.render('./pages/formRegister', localsParams);
    },
    userStore: async (req, res, next) => {
        const appConfig = await getAppConfig();
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
                        appConfig,
                        old: req.body,
                    });
                }

                const response = await db.usuario.create({
                    "nombre": req.body.cName,
                    "apellido": req.body.cLastName,
                    "email": req.body.email,
                    "password": bcrypt.hashSync(req.body.password, 10),
                    "admin": false,
                    "super": false,
                })

                const frontUserData = {
                    nombre: response.dataValues.nombre,
                    email: response.dataValues.email,
                    admin: response.dataValues.admin,
                    super: response.dataValues.super,
                };

                res.cookie('user', JSON.stringify(frontUserData), { maxAge: 60000 });
                req.session.usuarioLogueado = JSON.stringify(frontUserData);

                res.redirect('/')
            } catch (err) {
                console.log("err")
            }
        } else {
            res.render('./pages/formRegister', {
                appConfig,
                errors: errors.array(),
                old: req.body,
            });
        }


    },
    processLogin: async (req, res) => {
        let errors = validationResult(req);
        const appConfig = await getAppConfig();

        if (errors.isEmpty()) {
            const userData = await db.usuario.findOne({ where: { email: req.body.email } })
            console.log("userData", userData)

            if (!userData) {
                return res.render('./pages/formLogin', {
                    error: "Email invalido",
                    old: req.body,
                    appConfig,
                });
            }

            if (!bcrypt.compareSync(req.body.password, userData.password)) {
                return res.render('./pages/formLogin', {
                    error: "Password incorrecto",
                    old: req.body,
                    appConfig,
                });
            }

            if (userData.restringido) {
                return res.render('./pages/formLogin', {
                    error: "Acceso restringido: Comunicarse con el administrador del sitio",
                    old: req.body,
                    appConfig,
                });
            }

            const frontUserData = {
                nombre: userData.nombre,
                email: userData.email,
                admin: userData.admin,
                super: userData.super,
                id: userData.id,
            };

            if (req.body.mantenerSesion == 'on') {
                res.cookie('user', JSON.stringify(frontUserData), { maxAge: 60000 });
            }

            req.session.usuarioLogueado = JSON.stringify(frontUserData);

            res.redirect('/');
        } else {
            res.render('./pages/formLogin', {
                errors: errors.array(),
                old: req.body,
                appConfig,
            });
        }
    },
    account: async (req, res) => {
        const appConfig = await getAppConfig();
        const userData = getUserDataStringified(req);
        res.render('./pages/logueado', { userData, appConfig })
    },
    logOut: (req, res) => {
        res.clearCookie("user");// destroy the cookie
        req.session.destroy((err) => {
            res.redirect('/');
        }) // destroy all sessions

    },
    panel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig?.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_SUPER_PANEL?.valor);
        const formData = req.query;

        let localsParams = {
            userData,
            formData,
            appConfig,
        }

        getNotificationAlert(localsParams, req)

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
        const newData = {
            nombre: req.body.cName,
            apellido: req.body.cLastName,
            email: req.body.email,
            admin: req.body.admin == "SI",
            super: req.body.super == "SI",
            restringido: req.body.restringido == "SI",
        }

        try {
            const resp = await db.usuario.update(newData, { where: { id: req.params.id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                title: "Usuario editado correctamente",
            }
            res.status(200).json({ status: 200, message: "OK" })

        } catch (err) {
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Ups! ",
                title: "No se pudieron efectuar las modificaciones",
            }
            res.status(500).json({ status: 500, message: "ERROR" })
        }
    }

};
module.exports = controller;