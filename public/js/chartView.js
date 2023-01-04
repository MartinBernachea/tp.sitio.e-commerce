function showProducts(data){
    let contenedorTarjeta = document.getElementById("contenedor-tarjetas")
    let tarjetasPreIntroduccion = " ";
    data.data.forEach((productoActual, index) => {
        tarjetasPreIntroduccion = tarjetasPreIntroduccion + `<section class="product-detail-container">
        <div style="height:100%; aspect-ratio: 1/1; max-height: 200px;">
            <img src="/img/products/${productoActual.imagens[0].nombre}" alt="${productoActual.nombre}" class="img-producto-carrito">
        </div>
        <div class="detail-container">
            <div class="product-details">
                <div class="product-info">
        
                    <h4>${productoActual.nombre}</h4>
        
        
                    <select id="cantidad${index}" class="cantidades" >
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                        <option value="">4</option>
                        <option value="">5</option>
                        <option value="">6</option>
                        <option value="">7</option>
                        <option value="">8</option>
                        <option value="">9</option>
                        <option value="">10</option>
                    </select>
                </div>
                <div class="cantidad-container" id="precio${index}">
                    $${productoActual.precio}
                </div>
            </div>
        </div>
        </section> 
        `
    })
    contenedorTarjeta.innerHTML = tarjetasPreIntroduccion;
    
}

function getProductChartData(){
    let informacionLocalStorage = localStorage.getItem("carrito");
    if(informacionLocalStorage){
        fetch(window.location.origin + "/carrito/getDataFromArray" + "?chart=" + informacionLocalStorage)
            .then(respuesta => respuesta.json())
            .then(data => showProducts(data))
            .catch(e => console.log(e))
    }else{
        showProducts = [];
    }
}



window.addEventListener("load", function(){
    getProductChartData()
})

