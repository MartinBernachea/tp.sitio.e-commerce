const refreshDetailButtons = (productId, userId) => {
    const localData = localStorage.getItem("carrito");
    const localDataParsed = localData ? JSON.parse(localData) : {};

    let carrito = localDataParsed[userId] ?? [];

    const isProductInCart = carrito.indexOf(productId) >= 0;

    const btnAddProduct = document.querySelector("#btnAddProduct")
    const btnRemoveProduct = document.querySelector("#btnRemoveProduct")

    if (isProductInCart) {
        btnRemoveProduct.style.display = "block"
        btnAddProduct.style.display = "none"
    } else {
        btnAddProduct.style.display = "block"
        btnRemoveProduct.style.display = "none"
    }
}