const { Json } = require("sequelize/types/utils");

function agregarProducto(id){
    let informacionLocalStorage = localStorage.getItem("carrito");
    let carrito;
        if (informacionLocalStorage){
            carrito = JSON.parse(informacionLocalStorage);
        }else{
            carrito = [];
        };
    const lugarDelId = carrito.indexOf(id);
        if(lugarDelId == -1){
            carrito.push(id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }
}

function showProducts(data){
    console.log(data);
}

function getProductChartData(){
    let informacionLocalStorage = localStorage.getItem("carrito");
    if(informacionLocalStorage){
        fetch(url + "?chart=" + informacionLocalStorage)
            .then(respuesta => respuesta.json())
            .then(data => showProducts(data))
            .catch(e => console.log(e))
    }else{
        showProducts = [];
    }
}
