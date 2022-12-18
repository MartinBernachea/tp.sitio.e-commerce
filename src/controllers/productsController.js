const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const session = require('express-session');


const db = require("../database/models");
const sequelize = require("sequelize");

const { getUserDataStringified } = require('../utils/userData');
const config = require('../../appConfig');
const { generarOrderTablaProducto, generarOrderGenericoIdNombre } = require('../database/utils/orders');
const { formatProductDate } = require('../database/utils/format');
const { isParamNotEmpty } = require('../database/utils/generics');

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






    getCreateProduct: async (req, res) => {
        const userData = getUserDataStringified(req);

        const generos = db.genero.findAll();
        const marcas = db.marca.findAll();
        const categorias = db.categoria.findAll();

        const response = await Promise.all([generos, marcas, categorias])

        let localsParams = {
            userData,
            section: "createProduct",
            generos: response[0],
            marcas: response[1],
            categorias: response[2],
        }

        res.render('./pages/adminPanel', localsParams)
    },






    postCreateProduct: async (req, res) => {
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
    },


    productsPanel: async (req, res) => {
        const resultsPerPage = config.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL;
        let formData = { ...req.query, page: req.query.page ?? 1 };
        const currentPage = formData.page;

        let productsParams = {}
        if (isParamNotEmpty(formData.productId)) productsParams.id = formData.productId;

        if (isParamNotEmpty(formData.productName)) productsParams.nombre = { [sequelize.Op.substring]: formData.productName };

        if (isParamNotEmpty(formData.creadoHasta) || isParamNotEmpty(formData.creadoDesde)) {
            let fechaInicial = "0/0/0";
            let fechaFinal = new Date();
            if (isParamNotEmpty(formData.creadoDesde)) fechaInicial = formData.creadoDesde
            if (isParamNotEmpty(formData.creadoHasta)) fechaFinal = formData.creadoHasta
            productsParams.created_at = { [sequelize.Op.between]: [fechaInicial, fechaFinal] }
        }

        if (isParamNotEmpty(formData.lower) && isParamNotEmpty(formData.upper)) {
            productsParams.precio = { [sequelize.Op.between]: [formData.lower, formData.upper] }
        }

        const queryFilters = {
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            order: generarOrderTablaProducto(formData.order),
            where: productsParams,
            include: [
                {
                    model: db.usuario,
                    attributes: ["nombre", "apellido"],
                    where: isParamNotEmpty(formData.usuarioId) ? { id: formData.usuarioId } : {},
                },
                {
                    model: db.genero,
                    attributes: ["nombre"],
                    where: isParamNotEmpty(formData.generoId) ? { id: formData.generoId } : {},
                },
                {
                    model: db.marca,
                    attributes: ["nombre"],
                    where: isParamNotEmpty(formData.marcaId) ? { id: formData.marcaId } : {},
                },
                {
                    model: db.categoria,
                    attributes: ["nombre"],
                    where: isParamNotEmpty(formData.categoriaId) ? { id: formData.categoriaId } : {},
                },
            ],
        }

        const generos = db.genero.findAll();
        const marcas = db.marca.findAll();
        const categorias = db.categoria.findAll();
        const producosFiltrados = db.producto.findAndCountAll(queryFilters);

        const creadores = db.sequelize.query("SELECT usuario.id, usuario.nombre, usuario.apellido, COUNT(*) FROM `producto` INNER JOIN `usuario` ON usuario.id=producto.usuario_id GROUP BY usuario.id;")
        const rangoPrecios = db.producto.findAll({
            attributes: [
                [sequelize.fn('min', sequelize.col('precio')), 'lowerValue'],
                [sequelize.fn('max', sequelize.col('precio')), 'upperValue']
            ]
        })

        const response = await Promise.all([generos, marcas, categorias, producosFiltrados, creadores, rangoPrecios]);

        const formatedProductsElements = formatProductDate(response[3].rows)

        const products = {
            elements: formatedProductsElements,
            quantity: response[3].count,
            page: currentPage,
            resultsPerPage,
        }

        const userData = getUserDataStringified(req);

        if (req.session.notificationAlert) {
            localsParams.notificationAlert = req.session.notificationAlert;
            req.session.notificationAlert = null
        }

        let localsParams = {
            userData,
            section: "productsPanel",
            applicated: formData,
            products,
            opcionesGeneros: response[0],
            opcionesMarcas: response[1],
            opcionesCategorias: response[2],
            opcionesCreadores: response[4][0],
            rangoPrecios: response[5][0].dataValues,
        }

        res.render('./pages/adminPanel', localsParams)
    },







    categoriesPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const resultsPerPage = config.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL;
        let formData = { ...req.query, page: req.query.page ?? 1 };
        const currentPage = formData.page;

        let categoriesParams = {}
        if (isParamNotEmpty(formData.categoriaId)) categoriesParams.id = formData.categoriaId;
        if (isParamNotEmpty(formData.categoriaNombre)) categoriesParams.nombre = { [sequelize.Op.substring]: formData.categoriaNombre };

        const queryFilters = {
            subQuery: false,
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            order: generarOrderGenericoIdNombre(formData.order),
            where: categoriesParams,

            attributes: [
                "id",
                "nombre",
            ],
        }

        const response = await db.categoria.findAndCountAll(queryFilters);
        const categoriasSinCantidadProductos = response.rows;
        const categoriasIds = categoriasSinCantidadProductos.map(ctCategoria => ctCategoria.dataValues.id)

        let queryCondicionWhere = "";

        categoriasIds.forEach((ctId, index) => {
            queryCondicionWhere += "categoria_id=" + ctId

            if (index < categoriasIds.length - 1) {
                queryCondicionWhere += " OR "
            }
        })

        const cantidadesProductos = await db.sequelize.query("SELECT categoria_id as 'id', count(*) as'cantidad' FROM producto WHERE " + queryCondicionWhere + " GROUP BY categoria_id")
        const cantidadProductosFixed = cantidadesProductos[0]

        const categoriasConCantidadProductos = categoriasSinCantidadProductos.map(ctElement => {
            const formatedElement = {
                ...ctElement.dataValues
            }
            const cantidadIndex = cantidadProductosFixed.findIndex(ct => ct.id == formatedElement.id);
            formatedElement.cantidadProductos = cantidadIndex >= 0 ? cantidadProductosFixed[cantidadIndex].cantidad : 0
            return formatedElement
        })

        const categorias = {
            elements: categoriasConCantidadProductos,
            quantity: response.count,
            page: currentPage,
            resultsPerPage,
        }

        let localsParams = {
            categorias,
            userData,
            section: "categoriesPanel",
            applicated: formData,

        }

        res.render('./pages/adminPanel', localsParams)

    },


    genresPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const resultsPerPage = config.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL;
        let formData = { ...req.query, page: req.query.page ?? 1 };
        const currentPage = formData.page;

        let categoriesParams = {}
        if (isParamNotEmpty(formData.categoriaId)) categoriesParams.id = formData.categoriaId;
        if (isParamNotEmpty(formData.categoriaNombre)) categoriesParams.nombre = { [sequelize.Op.substring]: formData.categoriaNombre };

        const queryFilters = {
            subQuery: false,
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            order: generarOrderGenericoIdNombre(formData.order),
            where: categoriesParams,

            attributes: [
                "id",
                "nombre",
            ],
        }

        const response = await db.categoria.findAndCountAll(queryFilters);
        const categoriasSinCantidadProductos = response.rows;
        const categoriasIds = categoriasSinCantidadProductos.map(ctCategoria => ctCategoria.dataValues.id)

        let queryCondicionWhere = "";

        categoriasIds.forEach((ctId, index) => {
            queryCondicionWhere += "categoria_id=" + ctId

            if (index < categoriasIds.length - 1) {
                queryCondicionWhere += " OR "
            }
        })

        const cantidadesProductos = await db.sequelize.query("SELECT categoria_id as 'id', count(*) as'cantidad' FROM producto WHERE " + queryCondicionWhere + " GROUP BY categoria_id")
        const cantidadProductosFixed = cantidadesProductos[0]

        const categoriasConCantidadProductos = categoriasSinCantidadProductos.map(ctElement => {
            const formatedElement = {
                ...ctElement.dataValues
            }
            const cantidadIndex = cantidadProductosFixed.findIndex(ct => ct.id == formatedElement.id);
            formatedElement.cantidadProductos = cantidadIndex >= 0 ? cantidadProductosFixed[cantidadIndex].cantidad : 0
            return formatedElement
        })

        const categorias = {
            elements: categoriasConCantidadProductos,
            quantity: response.count,
            page: currentPage,
            resultsPerPage,
        }

        let localsParams = {
            categorias,
            userData,
            section: "genresPanel",
            applicated: formData,

        }

        res.render('./pages/adminPanel', localsParams)
    },

    brandsPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const resultsPerPage = config.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL;
        let formData = { ...req.query, page: req.query.page ?? 1 };
        const currentPage = formData.page;

        let categoriesParams = {}
        if (isParamNotEmpty(formData.categoriaId)) categoriesParams.id = formData.categoriaId;
        if (isParamNotEmpty(formData.categoriaNombre)) categoriesParams.nombre = { [sequelize.Op.substring]: formData.categoriaNombre };

        const queryFilters = {
            subQuery: false,
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            order: generarOrderGenericoIdNombre(formData.order),
            where: categoriesParams,

            attributes: [
                "id",
                "nombre",
            ],
        }

        const response = await db.categoria.findAndCountAll(queryFilters);
        const categoriasSinCantidadProductos = response.rows;
        const categoriasIds = categoriasSinCantidadProductos.map(ctCategoria => ctCategoria.dataValues.id)

        let queryCondicionWhere = "";

        categoriasIds.forEach((ctId, index) => {
            queryCondicionWhere += "categoria_id=" + ctId

            if (index < categoriasIds.length - 1) {
                queryCondicionWhere += " OR "
            }
        })

        const cantidadesProductos = await db.sequelize.query("SELECT categoria_id as 'id', count(*) as'cantidad' FROM producto WHERE " + queryCondicionWhere + " GROUP BY categoria_id")
        const cantidadProductosFixed = cantidadesProductos[0]

        const categoriasConCantidadProductos = categoriasSinCantidadProductos.map(ctElement => {
            const formatedElement = {
                ...ctElement.dataValues
            }
            const cantidadIndex = cantidadProductosFixed.findIndex(ct => ct.id == formatedElement.id);
            formatedElement.cantidadProductos = cantidadIndex >= 0 ? cantidadProductosFixed[cantidadIndex].cantidad : 0
            return formatedElement
        })

        const categorias = {
            elements: categoriasConCantidadProductos,
            quantity: response.count,
            page: currentPage,
            resultsPerPage,
        }

        let localsParams = {
            categorias,
            userData,
            section: "brandsPanel",
            applicated: formData,

        }

        res.render('./pages/adminPanel', localsParams)
    },
    

};

module.exports = controller;