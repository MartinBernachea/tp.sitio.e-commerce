function agregarProducto(productId, userId) {
    const localData = localStorage.getItem("carrito");
    const localDataParsed = localData ? JSON.parse(localData) : {};
    const notificationAlertRef = document.querySelector("#notificationAlert");

    let carrito = localDataParsed ? localDataParsed[userId] ?? [] : [];

    const isProductInCart = carrito.indexOf(productId) >= 0;

    if (!isProductInCart) {
        carrito.push(productId);
        localDataParsed[userId] = carrito;
        localStorage.setItem("carrito", JSON.stringify(localDataParsed));
        const notificationAlert = document.querySelector("#notificationAlert")
        const notificationTexto = document.querySelector("#notificationAlert b")
        notificationTexto.innerText = "El producto se añadio al carrito correctamente"
        notificationAlert.classList.add("success", "show")
        notificationAlertRef.classList.add("active");
        modalTimer = window.setTimeout(removeShowClass, 6000);

    } else {

        if (!notificationAlertRef.classList.contains("active")) {
            const notificationAlert = document.querySelector("#notificationAlert")
            const notificationTexto = document.querySelector("#notificationAlert b")
            notificationTexto.innerText = "El producto ya se encuentra en el carrito"
            notificationAlert.classList.add("info", "show")
            notificationAlertRef.classList.add("active");
            modalTimer = window.setTimeout(removeShowClass, 6000);
        }
        console.log("YA EXISTE EL PRODUCTO EN EL CARRITO")
    }
}




