const controller = {
    index: (req, res) => {
        res.render('index');
    },
    products: (req, res) => {
        res.render('./pages/detalleProducto')
    },
    chart: (req, res) => {
        res.render('./pages/carrito');
    },
    comingSoon: (req, res) => {
        res.render('./pages/coming-soon')
    },
    edit: (req, res) => {
        res.render('./pages/productEditForm')
    },
    create: (req, res) => {
        res.render('./pages/productCreateForm')
    }
};

module.exports = controller;