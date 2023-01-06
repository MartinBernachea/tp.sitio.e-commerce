const mainTag = document.querySelector("main")

function showProducts(data) {
    mainTag.classList.remove("loadingCartStatus")

    if (data.data.length == 0) {
        mainTag.classList.add("noProductsCartStatus")
    } else {
        mainTag.classList.remove("noProductsCartStatus")
        mainTag.classList.add("showResultsStatus")
    }

    let contenedorTarjeta = document.getElementById("contenedor-tarjetas")
    let tarjetasPreIntroduccion = " ";
    let sumatoriaInicial = 0;
    data.data.forEach((productoActual, index) => {
        sumatoriaInicial = sumatoriaInicial + Number(productoActual.precio);
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
                <div class="precio-por-cantidad" id="precio-por-cantidad${index}">
                    $${productoActual.precio}
                </div>
            </div>
        </div>
        </section> 
        `
    })
    let precioProducto = document.getElementById("precio-producto");
    let precioTotal = document.getElementById("precio-total");
    precioTotal.innerText = "$" + sumatoriaInicial;
    precioProducto.innerText = "$" + sumatoriaInicial;
    contenedorTarjeta.innerHTML = tarjetasPreIntroduccion;
    contenedorTarjeta.addEventListener("change", function (e) {

        const tagId = e.target.id
        if (tagId.includes("cantidad")) {
            const productoId = tagId.slice("cantidad".length, tagId.length)
            const precioUnitarioTag = document.getElementById(`precio${productoId}`)
            const precioCantidadTag = document.getElementById(`precio-por-cantidad${productoId}`)
            const precioUnitario = (precioUnitarioTag.innerText).slice(1, (precioUnitarioTag.innerText).length)
            console.log(precioUnitario);
            precioCantidadTag.innerText = "$" + precioUnitario * Number(e.target.value)
            const arrPreciosProductos = document.getElementsByClassName("precio-por-cantidad");
            let sumatoriaPrecios = 0;
            console.log(arrPreciosProductos);

            for (let i = 0; i < arrPreciosProductos.length; i++) {
                const precioTag = arrPreciosProductos[i];
                console.log(precioTag);
                const precio = (precioTag.innerText).slice(1, (precioTag.innerText).length)
                console.log(precio);
                sumatoriaPrecios = Number(precio) + sumatoriaPrecios
            }

            let precioProducto = document.getElementById("precio-producto");
            let ivaTotal = document.getElementById("ivaTotal");
            let precioTotal = document.getElementById("precio-total");
            precioTotal.innerText = "$" + sumatoriaPrecios;
            precioProducto.innerText = "$" + sumatoriaPrecios;
        }

    })

}

function getProductChartData(userId) {
    console.log("userId", userId)

    const localData = localStorage.getItem("carrito");
    const localDataParsed = localData ? JSON.parse(localData) : {};

    let carrito = localDataParsed[userId] ?? [];

    if (carrito.length == 0) {
        mainTag.classList.remove("loadingCartStatus", "showResultsStatus")
        mainTag.classList.add("noProductsCartStatus")
        return
    }

    fetch(window.location.origin + "/carrito/getDataFromArray" + "?cart=" + JSON.stringify(carrito))
        .then(respuesta => respuesta.json())
        .then(data => setTimeout(() => showProducts(data), 2000))
        .catch(e => console.log(e))

}
