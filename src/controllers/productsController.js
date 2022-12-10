const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const session = require('express-session');

const db = require("../database/models");
const { getUserDataStringified } = require('../utils/userData');

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

    create: (req, res) => {
        const userData = getUserDataStringified(req);

        db.categoria.findAll()
            .then(categorias => {
                res.render('./pages/productCreateForm', { categorias, userData })
            })
    },
    store: async (req, res) => {
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

    store: (req, res) => {

        console.log("req.query", req.query);


        db.producto.findAll({
            limit: 12,
            include: [{
                model: db.imagen,
            }]
        })
            .then(products => {
                const userData = getUserDataStringified(req);

                if (req.session.notificationAlert) {
                    localsParams.notificationAlert = req.session.notificationAlert;
                    req.session.notificationAlert = null
                }

                const filters = [
                    {
                        title: "Ordenar por",
                        type: "radio",
                        options: [
                            {
                                id: 1,
                                description: "Precio (de mayor a menor)"
                            },
                            {
                                id: 2,
                                description: "Precio (de menor a mayor)"
                            },
                        ]
                    },
                    {
                        title: "Genero",
                        type: "check",
                        options: [
                            {
                                id: 3,
                                description: "Mujer"
                            },
                            {
                                id: 4,
                                description: "Hombre"
                            },
                            {
                                id: 5,
                                description: "Niño"
                            },
                            {
                                id: 5,
                                description: "Unisex"
                            },
                        ]
                    },
                    {
                        title: "Marca",
                        type: "check",
                        options: [
                            {
                                id: 6,
                                description: "Nike"
                            },
                            {
                                id: 7,
                                description: "Adidas"
                            },
                            {
                                id: 8,
                                description: "Topper"
                            }
                        ]
                    },
                    {
                        title: "Tipo de producto",
                        type: "check",
                        options: [
                            {
                                id: 9,
                                description: "Calzado"
                            },
                            {
                                id: 10,
                                description: "Pantalones"
                            },
                            {
                                id: 11,
                                description: "Remeras"
                            },
                            {
                                id: 12,
                                description: "Camperas"
                            }
                        ]
                    },
                    {
                        title: "Actividades",
                        type: "check",
                        options: [
                            {
                                id: 13,
                                description: "Running"
                            },
                            {
                                id: 14,
                                description: "Futbol"
                            }
                        ]
                    }
                ]

                let products1 = [...products]
                products1.shift();
                const products2 = [...products1, ...products1, ...products1, ...products1, ...products1, ...products1]
                let localsParams = { products: [...products2], userData, filters, applicated: req.query }

                res.render("./pages/store.ejs", localsParams)
            })
    }
};

module.exports = controller;