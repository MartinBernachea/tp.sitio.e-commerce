// Se cargan los modulos necesarios.
var express = require('express');
var path = require('path');
const { mainModule } = require('process');

// Crea una Express app.
var app = express();

// obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
var publicPath = path.join(__dirname, '/public'); //path.join(__dirname, 'public'); también puede ser una opción

// Para que los archivos estaticos queden disponibles.
app.use(express.static(publicPath));

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/views/pages/formLogin.html');
});

app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/views/pages/formRegister.html');
});

app.get('/producto', function (req, res) {
    res.sendFile(__dirname + '/views/pages/detalleProducto.html');
});

app.get('/carrito', function (req, res) {
    res.sendFile(__dirname + '/views/pages/carrito.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/coming-soon', function (req, res) {
    res.sendFile(__dirname + '/views/pages/coming-soon.html');
});

app.get('/css', function (req, res) {
    res.sendFile(__dirname + '/public/assets/css/stylesheet.css');
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Servidor corriendo");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const mainRouter = require('./routes/main');
const productsRouter = require('./routes/products');
const chartRouter = require('./routes/chart');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use('/', mainRouter);
app.use('/', productsRouter);
app.use('/', chartRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
