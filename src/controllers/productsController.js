const path = require('path');

const controller = {
    products: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/views/pages/detalleProducto.html'));
    }
};

module.exports = controller;