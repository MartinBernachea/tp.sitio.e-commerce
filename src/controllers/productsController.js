const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const controller = {
    index: (req, res) => {
        res.render('index',{ productos: products });
    },
    products: (req, res) => {
        res.render('./pages/detalleProducto', { productos: products })
    },
    chart: (req, res) => {
        res.render('./pages/carrito');
    },
    comingSoon: (req, res) => {
        res.render('./pages/coming-soon')
    },
    edit: (req, res) => {
        res.render('./pages/productEditForm', { productos: products })
    },
    create: (req, res) => {
        res.render('./pages/productCreateForm')
    }
};

module.exports = controller;