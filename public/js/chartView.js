const mainTag = document.querySelector("main")

function getCantidadesProductos() {
    const arrCantidadesProductos = document.getElementsByClassName("cantidades");
    let sumatoriaCantidades = 0;
    for (let i = 0; i < arrCantidadesProductos.length; i++) {
        const cantidadTag = arrCantidadesProductos[i];
        sumatoriaCantidades = sumatoriaCantidades + Number(cantidadTag.value);
    }
    return sumatoriaCantidades
}

function refreshCarritoInfo() {
    const arrPreciosProductos = document.getElementsByClassName("precio-por-cantidad");
    const cantidadProductos = getCantidadesProductos()
    let sumatoriaPrecios = 0;
    for (let i = 0; i < arrPreciosProductos.length; i++) {
        const precioTag = arrPreciosProductos[i];
        const precio = (precioTag.innerText).slice(1, (precioTag.innerText).length)
        sumatoriaPrecios = Number(precio) + sumatoriaPrecios
    }
    const carritoTotal = document.querySelector("#carritoTotal")
    carritoTotal.innerHTML = `TOTAL (${cantidadProductos} producto${cantidadProductos > 1 ? "s" : ""}) <b>$${sumatoriaPrecios}</b>`

    const resumenCantidad = document.querySelector("#resumenCantidad")
    resumenCantidad.innerHTML = `${cantidadProductos} producto${cantidadProductos > 1 ? "s" : ""}`

    const resumenPreciosProductos = document.querySelector("#resumenPreciosProductos")
    resumenPreciosProductos.innerText = "$" + sumatoriaPrecios


    const resumenPrecioEnvio = document.querySelector("#resumenPrecioEnvio")
    console.log("sumatoriaPrecios", sumatoriaPrecios)
    resumenPrecioEnvio.innerText = sumatoriaPrecios >= Number(window.appConfig.SUMA_MINIMA_ENVIO_SIN_CARGO.valor) ? "GRATIS" : "$" + Number(window.appConfig.COSTO_ENVIO_GENERAL.valor)
}

function eliminarProductoCart(productId, userId) {
    const cantidadProductos = removerProducto(productId, userId);
    const producto = document.querySelector("#productCart" + productId)
    producto.remove();

    refreshCarritoInfo()

    if (cantidadProductos == 0) {
        mainTag.classList.remove("showResultsStatus", "loadingCartStatus")
        mainTag.classList.add("noProductsCartStatus")
    }
}

function showProducts(data, userId) {
    mainTag.classList.remove("loadingCartStatus")

    if (data.data.length == 0) {
        mainTag.classList.add("noProductsCartStatus")
    } else {
        mainTag.classList.remove("noProductsCartStatus")
        mainTag.classList.add("showResultsStatus")
    }

    let contenedorTarjeta = document.getElementById("contenedor-tarjetas")
    let tarjetasPreIntroduccion = " ";
    data.data.forEach((productoActual, index) => {
        tarjetasPreIntroduccion = tarjetasPreIntroduccion + `<section id="productCart${productoActual.id}" class="product-detail-container">
        <div style="height:100%; aspect-ratio: 1/1; max-height: 200px;">
            <img src="/img/products/${productoActual.imagens[0].nombre}" alt="${productoActual.nombre}" class="img-producto-carrito">
        </div>
        <div class="detail-container">
            <div class="product-details">
                <div class="product-info">
                    <div>
                        <h4 class="searchProducts_data">${productoActual.marca.nombre}</h4>
                        <h4>${productoActual.nombre}</h4>
                        <div class="cantidad-container" id="precio${index}">
                            $${productoActual.precio}
                        </div>
                    </div>
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
                <div class="product-item-total-container">
                    <i class="fa-solid fa-trash fa-sm btnShow" onclick="eliminarProductoCart(${productoActual.id},${userId})"></i>

                    <div class="precio-por-cantidad" id="precio-por-cantidad${index}">
                        $${productoActual.precio}
                    </div>
                </div>
            </div>
        </div>
        </section> 
        `
    })

    contenedorTarjeta.innerHTML = tarjetasPreIntroduccion;

    contenedorTarjeta.addEventListener("change", function (e) {
        const tagId = e.target.id
        if (tagId.includes("cantidad")) {
            const productoId = tagId.slice("cantidad".length, tagId.length)
            const precioUnitarioTag = document.getElementById(`precio${productoId}`)
            const precioCantidadTag = document.getElementById(`precio-por-cantidad${productoId}`)
            const precioUnitario = (precioUnitarioTag.innerText).slice(1, (precioUnitarioTag.innerText).length)
            precioCantidadTag.innerText = "$" + precioUnitario * Number(e.target.value)
            refreshCarritoInfo()
        }
    })

    refreshCarritoInfo()
}

function getProductChartData(userId) {
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
        .then(data => showProducts(data, userId))
        .catch(e => console.log(e))

}
