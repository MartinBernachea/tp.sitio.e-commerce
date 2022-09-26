const path = require('path');

const controller = {
    register: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/views/pages/formRegister.html'));
    }
};

module.exports = controller;