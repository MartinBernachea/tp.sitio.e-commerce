const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const session = require('express-session');

const db = require("../database/models");
const sequelize = require("sequelize");

const { getUserDataStringified } = require('../utils/userData');
const { generarOrderTablaProducto, generarOrderGenericoIdNombre } = require('../database/utils/orders');
const { formatProductDate } = require('../database/utils/format');
const { isParamNotEmpty, agregarCantidadesProductos } = require('../database/utils/generics');
const { getNotificationAlert } = require('../utils/notificationAlert');
const { getAppConfig } = require("../utils/appConfig")

const controller = {
    index: async (req, res) => {
        const appConfig = getAppConfig();
        const userData = getUserDataStringified(req);
        const nuevosLanzamientos = db.producto.findAll({
            order: [["id", "DESC"]],
            limit: 4,
            include: [
                { model: db.imagen, },
                { model: db.categoria, },
                { model: db.genero, },
                { model: db.marca, },
            ]
        })

        const productosDestacados = db.producto.findAll({
            limit: 4,
            include: [
                { model: db.imagen, },
                { model: db.categoria, },
                { model: db.genero, },
                { model: db.marca, },
            ]
        })

        const response = await Promise.all([appConfig, nuevosLanzamientos, productosDestacados,])

        let localsParams = {
            nuevosLanzamientos: response[1],
            productosDestacados: response[2],
            appConfig: response[0],
            userData,
        }

        getNotificationAlert(localsParams, req)

        res.render('index', localsParams)
    },

    chart: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();

        const productosDestacados = await db.producto.findAll({
            limit: 4,
            include: [
                { model: db.imagen, },
                { model: db.categoria, },
                { model: db.genero, },
                { model: db.marca, },
            ]
        })

        localsParams = {
            userData,
            appConfig,
            productosDestacados,
        }
        if (req.cookies.user != undefined) {
            res.render('./pages/carrito', localsParams);
        }
        else if (req.session.usuarioLogueado != undefined) {
            res.render('./pages/carrito', localsParams);
        }
        else res.redirect('user/login');
    },

    getDataFromArray: async (req, res) => {
        let productsIds = JSON.parse(req.query.cart);
        const productsData = await db.producto.findAll({
            where: {
                id: {
                    [sequelize.Op.in]: productsIds
                }
            },
            include: [{ model: db.genero }, { model: db.marca }, { model: db.categoria }, { model: db.imagen }]
        })
        res.status(200).json({
            status: 200, data: productsData.map(product => {
                return product.dataValues
            })
        })
    },

    comingSoon: async (req, res) => {
        const appConfig = await getAppConfig();
        const userData = getUserDataStringified(req);

        res.render('./pages/coming-soon', { userData, appConfig })
    },

    adminPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();

        res.render('./pages/adminPanel', { userData, appConfig });
    },

    getCreateProduct: async (req, res) => {
        const userData = getUserDataStringified(req);

        const generos = db.genero.findAll();
        const marcas = db.marca.findAll();
        const categorias = db.categoria.findAll();
        const appConfig = getAppConfig();

        const response = await Promise.all([generos, marcas, categorias, appConfig])

        let localsParams = {
            userData,
            appConfig,
            section: "createProduct",
            opcionesGeneros: response[0],
            opcionesMarcas: response[1],
            opcionesCategorias: response[2],
            appConfig: response[3],
            action: "create",
            submitButtonLabel: "Crear producto",
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
                categoria_id: req.body.categoriaId,
                marca_id: req.body.marcaId,
                genero_id: req.body.generoId,
                usuario_id: userData.id
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
                res.redirect('/admin/panel/products');
            } catch (err) { }
        }
        else {
            const generos = db.genero.findAll();
            const marcas = db.marca.findAll();
            const categorias = db.categoria.findAll();
            const appConfig = getAppConfig();

            const response = await Promise.all([generos, marcas, categorias, appConfig])
            let localsParams = {
                userData,
                appConfig,
                section: "createProduct",
                formData: req.body,
                opcionesGeneros: response[0],
                opcionesMarcas: response[1],
                opcionesCategorias: response[2],
                appConfig: response[3],
                errors: errors.array()
            }

            res.render('./pages/adminPanel', localsParams)
        }
    },

    getEditProduct: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();

        try {
            if (!req.params.id) throw new Error("Producto solicitado invalido.")
            const generos = db.genero.findAll();
            const marcas = db.marca.findAll();
            const categorias = db.categoria.findAll();
            const producto = db.producto.findByPk(req.params.id, {
                include: [{ model: db.imagen }]
            })
            const response = await Promise.all([generos, marcas, categorias, producto])

            if (response[3] == null) throw new Error("No se encontro el producto solicitado.")

            const formData = {
                name: response[3].nombre,
                price: response[3].precio,
                categoriaId: response[3].categoria_id,
                generoId: response[3].genero_id,
                marcaId: response[3].marca_id,
                images: response[3].imagens
            }

            let localsParams = {
                userData,
                appConfig,
                section: "createProduct",
                opcionesGeneros: response[0],
                opcionesMarcas: response[1],
                opcionesCategorias: response[2],
                formData,
                submitButtonLabel: "Editar producto",
                action: req.params.id,
            }

            res.render('./pages/adminPanel', localsParams)

        } catch (err) {
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Ups! ",
                title: err.message,
            }
            res.redirect("/admin/panel/products")
        }
    },

    postEditProduct: (req, res) => {

        let idProducto = req.params.id;

        let nombreImagenAntigua = "";

        db.producto.update({
            nombre: req.body.name,
            precio: req.body.price,
            categoria_id: req.body.categoriaId,
            marca_id: req.body.marcaId,
            genero_id: req.body.generoId,
            // imagen:req.file.imagen
        }, {
            where: { id: idProducto }

        })
        req.session.notificationAlert = {
            type: "success",
            boldTitle: "Bien! ",
            tag: `Se edito correctamente el producto`
        }
        res.redirect('/admin/panel/products');
    },

    deleteCategory: async (req, res) => {
        const categoria_id = req.body.id;
        try {
            const productos = await db.producto.findAll({ where: { categoria_id } });
            if (productos.length > 0) {
                throw new Error("No es posible eliminar categorias con productos")
            }
            const resp = await db.categoria.destroy({ where: { id: categoria_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se elimino correctamente la categoria`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Ups! ",
                title: err.message,
            }
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    deleteGenre: async (req, res) => {
        const genero_id = req.body.id;
        try {
            const productos = await db.producto.findAll({ where: { genero_id } });
            if (productos.length > 0) {
                throw new Error("No es posible eliminar generos con productos")
            }
            const resp = await db.genero.destroy({ where: { id: genero_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se elimino correctamente el genero`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Ups! ",
                title: err.message,
            }
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    deleteBrand: async (req, res) => {
        const marca_id = req.body.id;
        try {
            const productos = await db.producto.findAll({ where: { marca_id } });
            if (productos.length > 0) {
                throw new Error("No es posible eliminar marcas con productos")
            }
            const resp = await db.marca.destroy({ where: { id: marca_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se elimino correctamente la marca`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Ups! ",
                title: err.message,
            }
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    editCategory: async (req, res) => {
        const categoria_id = req.body.id;
        const categoria_nombre = req.body.nombre;
        try {
            if (categoria_nombre.trim().length == 0) throw new Error("No es posible asignar un nombre vacio");
            const categoriaExistente = await db.categoria.findOne({ where: { nombre: categoria_nombre } })
            if (categoriaExistente != null) throw new Error("Ya existe otra categoria con ese nombre");

            const resp = await db.categoria.update({ nombre: categoria_nombre }, { where: { id: categoria_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se edito correctamente la categoria`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    editGenre: async (req, res) => {
        const genero_id = req.body.id;
        const genero_nombre = req.body.nombre;
        try {
            if (genero_nombre.trim().length == 0) throw new Error("No es posible asignar un nombre vacio");
            const generoExistente = await db.genero.findOne({ where: { nombre: genero_nombre } })
            if (generoExistente != null) throw new Error("Ya existe otro genero con ese nombre");

            const resp = await db.genero.update({ nombre: genero_nombre }, { where: { id: genero_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se edito correctamente el genero`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    editBrand: async (req, res) => {
        const marca_id = req.body.id;
        const marca_nombre = req.body.nombre;
        try {
            if (marca_nombre.trim().length == 0) throw new Error("No es posible asignar un nombre vacio");
            const marcaExistente = await db.marca.findOne({ where: { nombre: marca_nombre } })
            if (marcaExistente != null) throw new Error("Ya existe otra marca con ese nombre");

            const resp = await db.marca.update({ nombre: marca_nombre }, { where: { id: marca_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se edito correctamente la marca`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    detail: async (req, res) => {

        let idProducto = req.params.id;

        try {
            const nuevosLanzamientos = await db.producto.findAll({
                order: [["id", "DESC"]],
                limit: 4,
                include: [
                    { model: db.imagen, },
                    { model: db.categoria, },
                    { model: db.genero, },
                    { model: db.marca, },
                ]
            })

            const productosDestacados = await db.producto.findAll({
                limit: 4,
                include: [
                    { model: db.imagen, },
                    { model: db.categoria, },
                    { model: db.genero, },
                    { model: db.marca, },
                ]
            })

            const currentProduct = await db.producto.findByPk(idProducto,
                {
                    include: [{
                        model: db.imagen
                    }]
                });
            const appConfig = await getAppConfig();
            const userData = getUserDataStringified(req);

            if (currentProduct) {
                res.render('./pages/detalleProducto', {
                    producto: currentProduct,
                    userData,
                    appConfig,
                    nuevosLanzamientos,
                    productosDestacados,
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

    deleteProduct: async (req, res) => {
        const producto_id = req.body.id;
        try {
            const resp = await db.producto.destroy({ where: { id: producto_id } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                tag: `Se elimino correctamente el producto`
            }
            res.status(200).json({ status: 200, message: "OK" })
        } catch (err) {
            req.session.notificationAlert = {
                type: "danger",
                boldTitle: "Ups! ",
                title: err.message,
            }
            res.status(500).json({ status: 500, message: err.message, error: true })
        }
    },

    destroyProduct: async (req, res) => {
        let pDeletedId = req.params.id;

        try {
            await db.producto.destroy({ where: { id: pDeletedId } });
            await db.imagen.destroy({ where: { producto_id: pDeletedId } });
            req.session.notificationAlert = {
                type: "success",
                boldTitle: "Bien! ",
                title: "Producto eliminado exitosamente",
            }
            res.redirect('/');

        } catch (err) {
            console.log("err", err)
        }
    },

    store: async (req, res) => {
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig?.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_STORE?.valor);
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
            distinct: true,
        }

        const generos = db.producto.findAll({
            include: [db.genero],
            group: "genero_id",
            attributes: ["genero.nombre"]
        });

        const marcas = db.producto.findAll({
            include: [db.marca],
            group: "marca_id",
            attributes: ["marca.nombre"]
        });

        const categorias = db.producto.findAll({
            include: [db.categoria],
            group: "categoria_id",
            attributes: ["categorium.nombre"]
        });

        const producosFiltrados = db.producto.findAndCountAll(queryFilters);
        const response = await Promise.all([generos, marcas, categorias, producosFiltrados]);

        const filters = [
            {
                title: filtersTitle[0],
                options: response[0].map(ctGenero => ctGenero.dataValues.genero.dataValues),
                type: "check",
            },
            {
                title: filtersTitle[1],
                options: response[1].map(ctMarca => ctMarca.dataValues.marca.dataValues),
                type: "check",
            },
            {
                title: filtersTitle[2],
                options: response[2].map(ctCategoria => ctCategoria.dataValues.categorium.dataValues),
                type: "check",
            },
        ];

        console.log("%%%%%%%%%%%%%%%%%")
        console.log("%%%%%%%%%%%%%%%%%")
        console.log("quantity", response[3].count)
        console.log("elements", response[3].rows)
        console.log("%%%%%%%%%%%%%%%%%")
        console.log("%%%%%%%%%%%%%%%%%")

        const products = {
            elements: response[3].rows,
            quantity: response[3].count,
            page: currentPage,
            resultsPerPage,
        }

        const userData = getUserDataStringified(req);

        let localsParams = {
            products,
            userData,
            appConfig,
            filters,
            applicated: formData
        }

        getNotificationAlert(localsParams, req)

        res.render("./pages/store.ejs", localsParams)
    },

    productsPanel: async (req, res) => {
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL.valor);
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

        let localsParams = {
            userData,
            appConfig,
            section: "productsPanel",
            applicated: formData,
            products,
            opcionesGeneros: response[0],
            opcionesMarcas: response[1],
            opcionesCategorias: response[2],
            opcionesCreadores: response[4][0],
            rangoPrecios: response[5][0].dataValues,
        }

        getNotificationAlert(localsParams, req)


        res.render('./pages/adminPanel', localsParams)
    },

    categoriesPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();

        const resultsPerPage = Number(appConfig.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL.valor);
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

        const cantidadesProductos = (categoriasSinCantidadProductos.length > 0) ?
            await db.sequelize.query("SELECT categoria_id as 'id', count(*) as'cantidad' FROM producto WHERE " + queryCondicionWhere + " GROUP BY categoria_id")
            : []

        const cantidadProductosFixed = cantidadesProductos[0]

        const categoriasConCantidadProductos = agregarCantidadesProductos(categoriasSinCantidadProductos, cantidadProductosFixed)

        const categorias = {
            elements: categoriasConCantidadProductos,
            quantity: response.count,
            page: currentPage,
            resultsPerPage,
        }

        let localsParams = {
            categorias,
            appConfig,
            userData,
            section: "categoriesPanel",
            applicated: formData,

        }

        getNotificationAlert(localsParams, req)

        res.render('./pages/adminPanel', localsParams)

    },

    genresPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL.valor);
        let formData = { ...req.query, page: req.query.page ?? 1 };
        const currentPage = formData.page;

        let genresParams = {}
        if (isParamNotEmpty(formData.generoId)) genresParams.id = formData.generoId;
        if (isParamNotEmpty(formData.generoNombre)) genresParams.nombre = { [sequelize.Op.substring]: formData.generoNombre };

        const queryFilters = {
            subQuery: false,
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            order: generarOrderGenericoIdNombre(formData.order),
            where: genresParams,

            attributes: [
                "id",
                "nombre",
            ],
        }

        const response = await db.genero.findAndCountAll(queryFilters);
        const generosSinCantidadProductos = response.rows;
        const generosIds = generosSinCantidadProductos.map(ctGenero => ctGenero.dataValues.id)

        let queryCondicionWhere = "";

        generosIds.forEach((ctId, index) => {
            queryCondicionWhere += "genero_id=" + ctId

            if (index < generosIds.length - 1) {
                queryCondicionWhere += " OR "
            }
        })

        const cantidadesProductos = (generosSinCantidadProductos.length > 0) ?
            await db.sequelize.query("SELECT genero_id as 'id', count(*) as'cantidad' FROM producto WHERE " + queryCondicionWhere + " GROUP BY genero_id")
            : []

        const cantidadProductosFixed = cantidadesProductos[0]

        const generosConCantidadProductos = agregarCantidadesProductos(generosSinCantidadProductos, cantidadProductosFixed)

        const generos = {
            elements: generosConCantidadProductos,
            quantity: response.count,
            page: currentPage,
            resultsPerPage,
        }

        let localsParams = {
            generos,
            appConfig,
            userData,
            section: "genresPanel",
            applicated: formData,
        }

        getNotificationAlert(localsParams, req)

        res.render('./pages/adminPanel', localsParams)
    },

    brandsPanel: async (req, res) => {
        const userData = getUserDataStringified(req);
        const appConfig = await getAppConfig();
        const resultsPerPage = Number(appConfig.CANT_RESULTADOS_POR_PAGINA_BUSQUEDA_ADMIN_PANEL.valor);
        let formData = { ...req.query, page: req.query.page ?? 1 };
        const currentPage = formData.page;

        let brandParams = {}
        if (isParamNotEmpty(formData.marcaId)) brandParams.id = formData.marcaId;
        if (isParamNotEmpty(formData.marcaNombre)) brandParams.nombre = { [sequelize.Op.substring]: formData.marcaNombre };

        const queryFilters = {
            subQuery: false,
            limit: resultsPerPage,
            offset: resultsPerPage * (currentPage - 1),
            order: generarOrderGenericoIdNombre(formData.order),
            where: brandParams,

            attributes: [
                "id",
                "nombre",
            ],
        }

        const response = await db.marca.findAndCountAll(queryFilters);
        const marcasSinCantidadProductos = response.rows;
        const marcasIds = marcasSinCantidadProductos.map(ctMarca => ctMarca.dataValues.id)

        let queryCondicionWhere = "";

        marcasIds.forEach((ctId, index) => {
            queryCondicionWhere += "marca_id=" + ctId

            if (index < marcasIds.length - 1) {
                queryCondicionWhere += " OR "
            }
        })

        const cantidadesProductos = (marcasSinCantidadProductos.length > 0) ?
            await db.sequelize.query("SELECT marca_id as 'id', count(*) as'cantidad' FROM producto WHERE " + queryCondicionWhere + " GROUP BY marca_id")
            : []

        const cantidadProductosFixed = cantidadesProductos[0]

        const marcasConCantidadProductos = agregarCantidadesProductos(marcasSinCantidadProductos, cantidadProductosFixed)

        const marcas = {
            elements: marcasConCantidadProductos,
            quantity: response.count,
            page: currentPage,
            resultsPerPage,
        }

        let localsParams = {
            marcas,
            userData,
            appConfig,
            section: "brandsPanel",
            applicated: formData,
        }

        getNotificationAlert(localsParams, req)


        res.render('./pages/adminPanel', localsParams)
    },

    createNewBrand: async (req, res) => {
        const brandObject = {
            nombre: req.body.nombre
        }

        const existElement = await db.marca.findOne({ where: brandObject })

        if (existElement != null) {
            res.status(401).json({ status: 401, message: "Ya existe una marca con ese nombre", error: true, })
        } else {
            try {
                const resp = await db.marca.create(brandObject);

                req.session.notificationAlert = {
                    type: "success",
                    boldTitle: "Bien! ",
                    tag: `Se creo correctamente la marca <b>${resp.dataValues.nombre}</b> con id <b>${resp.dataValues.id}</b>`
                }
                res.status(200).json({ status: 200, message: "OK" })

            } catch (err) {
                req.session.notificationAlert = {
                    type: "danger",
                    boldTitle: "Ups! ",
                    title: "No se pudo crear la marca",
                }
                res.status(500).json({ status: 500, message: "ERROR" })
            }
        }
    },

    createNewGenre: async (req, res) => {
        const genreObject = {
            nombre: req.body.nombre
        }

        const existElement = await db.genero.findOne({ where: genreObject })

        if (existElement != null) {
            res.status(401).json({ status: 401, message: "Ya existe un genero con ese nombre", error: true, })
        } else {
            try {
                const resp = await db.genero.create(genreObject);

                req.session.notificationAlert = {
                    type: "success",
                    boldTitle: "Bien! ",
                    tag: `Se creo correctamente el genero <b>${resp.dataValues.nombre}</b> con id <b>${resp.dataValues.id}</b>`
                }
                res.status(200).json({ status: 200, message: "OK" })

            } catch (err) {
                req.session.notificationAlert = {
                    type: "danger",
                    boldTitle: "Ups! ",
                    title: "No se pudo crear el genero",
                }
                res.status(500).json({ status: 500, message: "ERROR" })
            }
        }
    },

    createNewCategory: async (req, res) => {
        const categoryObject = {
            nombre: req.body.nombre
        }

        const existElement = await db.categoria.findOne({ where: categoryObject })

        if (existElement != null) {
            res.status(401).json({ status: 401, message: "Ya existe una categoria con ese nombre", error: true, })
        } else {
            try {
                const resp = await db.categoria.create(categoryObject);

                req.session.notificationAlert = {
                    type: "success",
                    boldTitle: "Bien! ",
                    tag: `Se creo correctamente la categoria <b>${resp.dataValues.nombre}</b> con id <b>${resp.dataValues.id}</b>`
                }
                res.status(200).json({ status: 200, message: "OK" })

            } catch (err) {
                req.session.notificationAlert = {
                    type: "danger",
                    boldTitle: "Ups! ",
                    title: "No se pudo crear la categroia",
                }
                res.status(500).json({ status: 500, message: "ERROR" })
            }
        }
    },

    productsSearch: async (req, res) => {
        const nombreBusqueda = req.query.nombre
        const resp = await db.producto.findAndCountAll(
            {
                where: { nombre: { [sequelize.Op.substring]: nombreBusqueda } },
                limit: 3,
                include: [
                    db.imagen,
                    db.categoria,
                    db.genero,
                    db.marca,
                ],
                distinct: true,
            }
        )

        const data = {
            elements: resp.rows,
            quantity: resp.count,
        }

        res.status(200).json({ status: 200, data })
    },

};

module.exports = controller;