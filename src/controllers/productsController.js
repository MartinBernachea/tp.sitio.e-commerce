const controller = {
    products: (req, res) => {
        res.render('./pages/detalleProducto')
    },
    edit: (req, res) => {
        res.render('./pages/productEditForm')
    }
};

module.exports = controller;