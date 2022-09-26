const path = require('path');
const fs = require('fs');

const controller = {
    index: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/views/index.html'));
    }
};

module.exports = controller;