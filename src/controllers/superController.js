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

    usersPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig?.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_SUPER_PANEL?.valor);
        const formData = req.query;

        let localsParams = {
            userData,
            formData,
            appConfig,
            section: "usersPanel",
        }

        getNotificationAlert(localsParams, req)

        // const wasFormSent = Object.values(formData).length > 0;
        const isFormEmpty = Object.values(formData).every(ctValue => {
            return ctValue.trim() ? ctValue.trim() : ctValue
        });

        // if (wasFormSent) {
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

        localsParams["usersResults"] = {
            elements,
            quantity: allElements.length,
            page: currentPage,
            resultsPerPage,
        }
        // }

        res.render('./pages/superPanel', localsParams);
    },
    configPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig?.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_SUPER_PANEL?.valor);
        const formData = { ...req.query };

        let localsParams = {
            userData,
            formData,
            appConfig,
            section: "configPanel",
        }

        getNotificationAlert(localsParams, req)

        // const wasFormSent = Object.values(formData).length > 0;
        const isFormEmpty = Object.values(formData).every(ctValue => {
            return ctValue.trim() ? ctValue.trim() : ctValue
        });

        // if (wasFormSent) {
        const currentPage = formData.page ?? 1;
        let queryFilters = {
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            attributes: ["id", "nombre", "valor", "descripcion"]
        }

        let formFilters;

        if (!isFormEmpty) {
            let filters = {}
            const Op = db.Sequelize.Op;
            if (formData.nombre) filters["nombre"] = { [Op.like]: `%${formData.nombre}%` }
            if (formData.valor) filters["valor"] = { [Op.like]: `%${formData.valor}%` }
            if (formData.descripcion) filters["descripcion"] = { [Op.like]: `%${formData.descripcion}%` }
            formFilters = { where: filters };
            queryFilters["where"] = filters;
        }

        const allElements = await db.config.findAll(formFilters)
        const elements = await db.config.findAll(queryFilters)

        localsParams = {
            ...localsParams,
            configResults: {
                elements,
                quantity: allElements.length,
                page: currentPage,
                resultsPerPage,
            }
        }

        res.render('./pages/superPanel', localsParams);
    },

    editConfig: async (req, res) => {
        const config_id = req.body.id;
        const config_valor = req.body.valor;
        try {
            const resp = await db.config.update({ valor: config_valor }, { where: { id: config_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se edito correctamente la configuracion`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },
}

module.exports = controller;
