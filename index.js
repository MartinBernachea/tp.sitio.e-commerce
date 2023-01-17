// ************ Require's ************
const express = require('express');
const path = require('path');
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');



// ************ Route System require and use() ************
const userRouter = require('./src/routes/user'); // Rutas /user
const superRouter = require('./src/routes/super'); // Rutas /user
const productsRouter = require('./src/routes/products'); // Rutas /products
const apiRouter = require("./src/routes/api"); // Rutas /api
const { cookie } = require('express-validator');

// ************ express() - (don't touch) ************
var app = express();

// ************ Cors ************
app.use(cors())

// ************ Middlewares - (don't touch) ************
app.use(express.static('public'));   // Para que los archivos estaticos queden disponibles.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE
app.use(session({secret: "Es un secreto"})); 
app.use(cookieParser());


app.listen(process.env.PORT || 3000, function() {
    console.log("Servidor corriendo");
})

// ************ Template Engine - (don't touch) ************
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/user', userRouter);
app.use('/super', superRouter);
app.use('/', productsRouter);
app.use("/api", apiRouter);

