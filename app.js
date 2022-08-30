const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req,res) =>{
    res.sendFile(path.resolve(__dirname, './views/index.html'));
});

app.use(express.static(path.resolve(__dirname, './public')));


app.listen(3002, () => {
    console.log("Servidor corriendo");
});
