// ************ Require's ************
const express = require('express');
const path = require('path');
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE

// ************ Route System require and use() ************
const userRouter = require('./routes/user'); // Rutas /user
const productsRouter = require('./routes/products'); // Rutas /products

// ************ express() - (don't touch) ************
var app = express();


// ************ Middlewares - (don't touch) ************
app.use(express.static('public'));   // Para que los archivos estaticos queden disponibles.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE


app.listen(process.env.PORT || 3000, function() {
    console.log("Servidor corriendo");
})


// ************ Template Engine - (don't touch) ************
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));



app.use('/user', userRouter);
app.use('/', productsRouter);

