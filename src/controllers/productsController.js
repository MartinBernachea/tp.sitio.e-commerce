const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const session = require('express-session');


const db = require("../database/models");
const sequelize = require("sequelize");

const { getUserDataStringified } = require('../utils/userData');
const config = require('../../appConfig');

const controller = {
    index: (req, res) => {
        db.producto.findAll({
            limit: 12,
            include: [{
                model: db.imagen,
            }]
        })
            .then(productos => {
                const userData = getUserDataStringified(req);
                let localsParams = { productos, userData }

                if (req.session.notificationAlert) {
                    localsParams.notificationAlert = req.session.notificationAlert;
                    req.session.notificationAlert = null
                }

                res.render('index', localsParams)
            })
    },
    chart: async (req, res) => {
        const userData = getUserDataStringified(req);

        if (req.cookies.user != undefined) {
            res.render('./pages/carrito', { userData });
        }
        else if (req.session.usuarioLogueado != undefined) {
            res.render('./pages/carrito', { userData });
        }
        else res.redirect('user/login');
    },
    comingSoon: (req, res) => {
        const userData = getUserDataStringified(req);

        res.render('./pages/coming-soon', { userData })
    },
    edit: (req, res) => {
        let idProducto = req.params.id;
        const userData = getUserDataStringified(req);

        db.producto.findByPk(idProducto)
            .then(function (producto) {

                if (producto != null) {
                    db.categoria.findAll()
                        .then(function (categorias) {
                            res.render('./pages/productEditForm', { producto: producto, categorias: categorias, userData });
                        })
                } else { res.redirect("/") }
            })
    },
    update: (req, res) => {

        let idProducto = req.params.id;

        let datosProducto = req.body;

        let nombreImagenAntigua = "";

        console.log(datosProducto);
        // db.producto.update({
        //     nombre:datosProducto.nombre,
        //     precio:datosProducto.precio,
        //     categoria:datosProducto.categoria,
        //     imagen:req.file.imagen
        // }, { where: {id:idProducto}

        // })

        // res.redirect('/');
    },

    adminPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        res.render('./pages/adminPanel', { userData });
    },

    productsPanel: (req, res) => {
        const userData = getUserDataStringified(req);

        db.categoria.findAll()
            .then(categorias => {
                res.render('./pages/adminPanel', { categorias, userData, section: "productsPanel" })
            })
    },

    categoriesPanel: (req, res) => {
        const userData = getUserDataStringified(req);

        db.categoria.findAll()
            .then(categorias => {
                res.render('./pages/adminPanel', { categorias, userData, section: "categoriesPanel" })
            })
    },


    store1: async (req, res) => {
        const userData = getUserDataStringified(req);
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            nuevoProducto = {
                nombre: req.body.name,
                precio: req.body.price,
                categoria_id: req.body.category,
            };

            try {
                const respNewProduct = await db.producto.create(nuevoProducto);
                const imagesTag = ["cImage1", "cImage2", "cImage3", "cImage4", "cImage5"];
                const uploadedImages = req.files;
                const arrProductImages = [];
                imagesTag.forEach(currentTag => {
                    const principal = currentTag == imagesTag[0];
                    if (uploadedImages[currentTag]) {
                        arrProductImages.push({
                            nombre: uploadedImages[currentTag][0].filename,
                            producto_id: respNewProduct.id,
                            principal,
                        });
                    } else {
                        arrProductImages.push({
                            nombre: 'no-image.png',
                            producto_id: respNewProduct.id,
                            principal,
                        });
                    }
                })
                const respNewImages = await db.imagen.bulkCreate(arrProductImages);
                req.session.notificationAlert = {
                    type: "success",
                    boldTitle: "Bien! ",
                    title: "Producto creado exitosamente:",
                    tag: `<a href="/detail/${respNewProduct.id}">${req.body.name}</a>`,
                }
                res.redirect('/');
            } catch (err) { }
        }
        else {
            res.render('./pages/productCreateForm', { errors: errors.array(), userData });
        }

    },
    detail: async (req, res) => {
        
        let idProducto = req.params.id;

        try {
            const currentProduct = await db.producto.findByPk(idProducto,
                {
                    include: [{
                        model: db.imagen
                    }]
                });

            console.log("currentProduct", currentProduct.imagens[0].nombre)

            const userData = getUserDataStringified(req);
            if (currentProduct) {
                res.render('./pages/detalleProducto', {
                    producto: currentProduct,
                    userData
                });
            } else {
                req.session.notificationAlert = {
                    type: "danger",
                    boldTitle: "ups! ",
                    title: "Producto no encontrado",
                }
                res.redirect('/');
            }
        }

        catch {
            error => console.log(error)
        }

    },
    destroy: (req, res) => {
        let pDeletedId = req.params.id;

        db.producto.destroy({
            where: { id: pDeletedId }
        }).then(resp => {

            db.imagen.destroy(
                {
                    where: { producto_id: pDeletedId },
                }
            );

            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                title: "Producto eliminado exitosamente",
            }
            res.redirect('/');
        })
    },

    store: async (req, res) => {
        const resultsPerPage = config.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_STORE;
        let formData = { ...req.query, Page: req.query.Page ?? 1 };
        const currentPage = formData.Page;
        const filtersTitle = ["Generos", "Marcas", "Categorias"];

        /* Se busca unificar req.query de los filtros: 
            Tenemos filtros agrupados:
            Marca: Adidas / Nike / Topper / etc
            Si seleccionamos solo 1 se recibe su id: Marca: "1"
            Si se selecciona mas de 1 se reciben ambos ids en un array: Marca: ["1", "2"]
            Con esta moficiacion siempre se recibe en un array, sin importar la cantidad.
        */
        filtersTitle.forEach(ctTitle => {
            if (typeof (formData[ctTitle]) == "string") {
                formData = { ...formData, [ctTitle]: [formData[ctTitle]] }
            }
        })
        /* ***** */

        const queryFilters = {
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            attributes: [
                "id",
                "precio",
                "nombre",
                // [sequelize.fn('COUNT', 'id'), 'cantidad']
            ],
            include: [
                {
                    model: db.imagen
                },
                {
                    model: db.genero,
                    where: formData[filtersTitle[0]]?.length > 0 ? { id: { [sequelize.Op.in]: formData[filtersTitle[0]] } } : {}
                },
                {
                    model: db.marca,
                    where: formData[filtersTitle[1]]?.length > 0 ? { id: { [sequelize.Op.in]: formData[filtersTitle[1]] } } : {}
                },
                {
                    model: db.categoria,
                    where: formData[filtersTitle[2]]?.length > 0 ? { id: { [sequelize.Op.in]: formData[filtersTitle[2]] } } : {}
                },
            ],
        }

        const generos = db.genero.findAll();
        const marcas = db.marca.findAll();
        const categorias = db.categoria.findAll();
        const producosFiltrados = db.producto.findAndCountAll(queryFilters);
        const response = await Promise.all([generos, marcas, categorias, producosFiltrados]);

        const filters = [
            {
                title: filtersTitle[0],
                options: response[0],
                type: "check",
            },
            {
                title: filtersTitle[1],
                options: response[1],
                type: "check",
            },
            {
                title: filtersTitle[2],
                options: response[2],
                type: "check",
            },
        ];

        const products = {
            elements: response[3].rows,
            quantity: response[3].count,
            page: currentPage,
            resultsPerPage,
        }

        console.log("products", products)
        const userData = getUserDataStringified(req);

        if (req.session.notificationAlert) {
            localsParams.notificationAlert = req.session.notificationAlert;
            req.session.notificationAlert = null
        }

        let localsParams = {
            products,
            userData,
            filters,
            applicated: formData
        }

        res.render("./pages/store.ejs", localsParams)
    }
};

module.exports = controller;