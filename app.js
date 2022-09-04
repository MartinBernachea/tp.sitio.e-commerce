// Se cargan los modulos necesarios.
var express = require('express');
var path = require('path');

// Crea una Express app.
var app = express();

// obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
var publicPath = path.join(__dirname, '/public'); //path.join(__dirname, 'public'); también puede ser una opción

// Para que los archivos estaticos queden disponibles.
app.use(express.static(publicPath));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/css', function (req, res) {
    res.sendFile(__dirname + '/public/assets/css/stylesheet.css');
});

app.listen(3002, () => {
    console.log("Servidor corriendo");
});