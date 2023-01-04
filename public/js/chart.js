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




