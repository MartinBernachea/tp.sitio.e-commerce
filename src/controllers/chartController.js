const path = require('path');

const controller = {
    chart: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/views/pages/carrito.html'));
    }
};

module.exports = controller;