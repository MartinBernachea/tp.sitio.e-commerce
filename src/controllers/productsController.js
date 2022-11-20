const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const session = require('express-session');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const db = require("../database/models");


const controller = {
    index: (req, res) => {
        db.producto.findAll({
            limit: 12
        })
            .then(productos => {
                let localsParams = { productos }

                if (req.session.notificationAlert) {
                    localsParams.notificationAlert = req.session.notificationAlert;
                    req.session.notificationAlert = null
                }

                res.render('index', localsParams)
            })
    },
    chart: (req, res) => {
        if (req.cookies.user != undefined) {
            res.render('./pages/carrito', { productos: products });
        }
        else if (req.session.usuarioLogueado != undefined) {
            res.render('./pages/carrito', { productos: products });
        }
        else res.redirect('user/login');
    },
    comingSoon: (req, res) => {
        res.render('./pages/coming-soon')
    },
    edit: (req, res) => {
        let idProducto = req.params.id;


        db.producto.findByPk(idProducto)
            .then(function (producto) {

                if (producto != null) {
                    db.categoria.findAll()
                    .then(function(categorias) {
                    res.render('./pages/productEditForm', { producto: producto, categorias: categorias });
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
        db.categoria.findAll()
            .then(categorias => {
                res.render('./pages/productCreateForm', { categorias })
            })
    },
    store: async (req, res) => {

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
            res.render('./pages/productCreateForm', { errors: errors.array() });
        }

    },
    detail: async(req, res) => {

        let idProducto = req.params.id;

        try{
            const currentProduct = await db.producto.findByPk(idProducto);
            if(currentProduct){
                res.render('./pages/detalleProducto', {
                    producto: currentProduct
                });
            }else {
                req.session.notificationAlert = {
                    type: "danger",
                    boldTitle: "ups! ",
                    title: "Producto no encontrado",
                }
                res.redirect('/');
            }}

        catch{
            error => console.log(error)}

    },
    destroy: (req, res) => {
        let pDeletedId = req.params.id;

        let nombreImagenAntigua = "";

        for (let o of products) {
            if (o.id == pDeletedId) {
                nombreImagenAntigua = o.image;
            }
        }

        let nuevaListaProductos = products.filter(function (e) {
            return e.id != pDeletedId;
        });

        db.producto.destroy({
            where: { id: pDeletedId}
        })

        res.redirect('/');
    }
};

module.exports = controller;