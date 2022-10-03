// Se cargan los modulos necesarios.
const express = require('express');
const path = require('path');

const variableNueva = require('./routes/index.routes')

// Crea una Express app.
var app = express();

// Para que los archivos estaticos queden disponibles.
app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function() {
    console.log("Servidor corriendo");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.use('/', variableNueva);