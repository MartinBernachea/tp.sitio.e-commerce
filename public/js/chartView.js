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
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="cantidad-container" id="precio${index}">
                    $${productoActual.precio}
                </div>
                <div id="precio-por-cantidad${index}">
                    $${productoActual.precio}
                </div>
            </div>
        </div>
        </section> 
        `
    })
    contenedorTarjeta.innerHTML = tarjetasPreIntroduccion;
    contenedorTarjeta.addEventListener("change", function(e){
        console.log(e.target.value);
        console.log(typeof(e.target.value));
    const tagId = e.target.id
    if(tagId.includes("cantidad")){
        const productoId = tagId.slice("cantidad".length, tagId.length)
        const precioUnitarioTag = document.getElementById(`precio${productoId}`)
        const precioCantidadTag = document.getElementById(`precio-por-cantidad${productoId}`)
        const precioUnitario = (precioUnitarioTag.innerText).slice(1, (precioUnitarioTag.innerText).length)
        console.log(precioUnitario);
        precioCantidadTag.innerText="$" + precioUnitario*Number(e.target.value)
    }
    
    })
    
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

