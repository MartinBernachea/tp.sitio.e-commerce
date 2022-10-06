const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const controller = {
    index: (req, res) => {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        res.render('index',{ productos: products });
    },
    products: (req, res) => {
        res.render('./pages/detalleProducto', { productos: products })
    },
    chart: (req, res) => {
        res.render('./pages/carrito' , { productos: products });
    },
    comingSoon: (req, res) => {
        res.render('./pages/coming-soon')
    },
    edit: (req, res) => {
        res.render('./pages/productEditForm', { productos: products })
    },
    create: (req, res) => {
        res.render('./pages/productCreateForm')

    },
    store: (req, res) => {
        let datos = req.body;
        let idNuevoProducto = (products[products.length-1].id)+1;
        // let imagenNuevoProducto = 'qqqqq.jpg';
        let nuevoProducto = {
            "id": idNuevoProducto,
            "name": datos.name,
            "price": parseInt(datos.price),
            "category": datos.category,
             // "image": imagenNuevoProducto
        };             
        products.push(nuevoProducto);
        fs.writeFileSync(productsFilePath,JSON.stringify(products,null,' '),'utf-8');            
        res.redirect ('/');
    },
    detail: (req, res) => {

        let idProducto = req.params.id;

        let productoBuscado=null;

        for(let m of products){
            if  (m.id == idProducto){
                productoBuscado = m;
                break;
            }
        }

        if(productoBuscado!=null){
            res.render('./pages/detalleProducto', {producto : productoBuscado});
        }
        
        res.send("Error, producto no encontrado");
        
    }
};

module.exports = controller;