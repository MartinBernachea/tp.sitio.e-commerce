const { json } = require("express/lib/response");



function agregarProducto(id){
    const productoGuardado = localStorage.getItem("carrito");
    let carrito = []
    if(productoGuardado){
        carrito = [...JSON.parse(productoGuardado)]
        
    }
    
    carrito.push(id) 
    
    localStorage.setItem("carrito", JSON.stringify(carrito))
}



