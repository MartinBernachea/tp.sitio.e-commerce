const path = require('path');

const controller = {
    login: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/views/pages/formLogin.html'));
    }
};

module.exports = controller;