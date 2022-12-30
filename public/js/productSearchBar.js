import { getProductsLike } from "./service/getProductsLike.js";

const searchBarInput = document.querySelector("#searchBarInput");
const searchBarSpinner = document.querySelector("#searchBarSpinner");
const searchResultsContainer = document.querySelector("#searchResultsContainer");

const searchProductsNoResultados = document.querySelector("#searchProductsNoResultados");
const searchProductsVerMas = document.querySelector("#searchProductsVerMas");

const producto1 = document.querySelector("#producto1")
const producto2 = document.querySelector("#producto2")
const producto3 = document.querySelector("#producto3")
const arrProductos = [producto1, producto2, producto3];

const setearDataEnProductoContainer = (productoContainer, data) => {
    productoContainer.style.display = "flex";
    productoContainer.querySelector("a").href = "/detail/" + data.id
    productoContainer.querySelector("#productoImagen").src = "/img/products/" + data.imagens[0].nombre;
    productoContainer.querySelector("#productoData").innerText = `${data.categorium?.nombre} | ${data.marca?.nombre} | ${data.genero?.nombre}`
    productoContainer.querySelector("#productoNombre").innerText = data.nombre;
    productoContainer.querySelector("#productoPrecio").innerText = "$" + data.precio;
}



const mostrarResultados = (response) => {
    const cantidadMaximaResultados = 3;

    searchBarSpinner.style.display = "none";
    const productsData = response.data

    if (productsData.quantity == 0) {
        searchProductsNoResultados.style.display = "block";
        producto1.style.display = "none";
        producto2.style.display = "none";
        producto3.style.display = "none";
        searchProductsVerMas.style.display = "none"
        return
    }

    if (productsData.quantity > 0) {
        searchProductsNoResultados.style.display = "none"
        productsData.elements.forEach((ctProduct, index) => {
            setearDataEnProductoContainer(arrProductos[index], ctProduct)
        })

        if (productsData.quantity < cantidadMaximaResultados) {
            const cantidadProductosOcultar = cantidadMaximaResultados - productsData.quantity;
            for (let i = 1; i <= cantidadProductosOcultar; i++) {
                arrProductos[arrProductos.length - i].style.display = "none"
            }
        }

        if (productsData.quantity > 3) {
            searchProductsVerMas.innerHTML = `En total hay&nbsp;<b>${productsData.quantity}</b> &nbsp;resultados:&nbsp;<a href="/store">Ver todos</a>`
            searchProductsVerMas.style.display = "flex"
        } else {
            searchProductsVerMas.innerHTML = `En total hay&nbsp;<b>${productsData.quantity}</b> &nbsp;resultados.`
            searchProductsVerMas.style.display = "flex"
        }
    }
}

const searchInputEvent = (e) => {
    const cantidadMinimaLetrasParaBusqueda = 3;
    if (e.target.value.length >= cantidadMinimaLetrasParaBusqueda) {
        searchBarSpinner.style.display = "block";
        getProductsLike({ nombre: e.target.value })
            /* TODO: SACAR DELAY */
            /* 
            .then(response => {
                mostrarResultados(response))
                searchResultsContainer.style.display = "block";
            }; 
            */
            .then(response => setTimeout(() => {
                mostrarResultados(response)
                searchResultsContainer.style.display = "block";
            }, 1000)
            );
    } else {
        searchResultsContainer.style.display = "none";
    }
}

searchBarInput.addEventListener("keyup", (e) => {
    searchInputEvent(e)
})

let onBlur = false;
let onMouse = false;

searchBarInput.addEventListener("focus", (e) => {
    onBlur = true;
    searchInputEvent(e)
})

searchBarInput.addEventListener("blur", (e) => {
    onBlur = false;
    if (!onBlur && !onMouse) {
        searchResultsContainer.style.display = "none";
    }
})

searchResultsContainer.addEventListener("mouseenter", (e) => {
    onMouse = true;
})

searchResultsContainer.addEventListener("mouseleave", (e) => {
    onMouse = false;
    if (!onBlur && !onMouse) {
        searchResultsContainer.style.display = "none";
    }
})
