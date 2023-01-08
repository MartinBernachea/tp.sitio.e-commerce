const btnAddProduct = document.querySelector("#btnAddProduct")
const btnRemoveProduct = document.querySelector("#btnRemoveProduct")

function agregarProducto(productId, userId) {
    const notificationAlert = document.querySelector("#notificationAlert")
    const notificationTexto = document.querySelector("#notificationAlert .alert-msg")
    const notificationIcono = document.querySelector("#notificationAlert #notificationIcon")

    if (!userId) {
        notificationTexto.innerHTML = "Para agregar un producto al <b>carrito</b> es necesario <a href='/user/login'><b>Iniciar sesion</b></a>";
        notificationAlert.classList.add("info", "show", "active");
        notificationAlert.classList.remove("success", "danger", "hidde-alert");
        notificationIcono.classList.add("fa-circle-info")
        notificationIcono.classList.remove("fa-check", "fa-circle-exclamation")

        if (modalTimer) window.clearTimeout(modalTimer);
        modalTimer = window.setTimeout(removeShowClass, 6000);
        return
    }

    const localData = localStorage.getItem("carrito");
    const localDataParsed = localData ? JSON.parse(localData) : {};

    let carrito = localDataParsed[userId] ?? [];

    const isProductInCart = carrito.indexOf(productId) >= 0;

    if (!isProductInCart) {
        carrito.push(productId);
        localDataParsed[userId] = carrito;
        localStorage.setItem("carrito", JSON.stringify(localDataParsed));
        notificationTexto.innerHTML = "<b>Bien!</b> El producto se añadio al carrito correctamente"
        notificationAlert.classList.add("success", "show", "active")
        notificationAlert.classList.remove("info", "danger", "hidde-alert")
        notificationIcono.classList.add("fa-check")
        notificationIcono.classList.remove("fa-circle-info", "fa-circle-exclamation")
        if (modalTimer) window.clearTimeout(modalTimer);
        modalTimer = window.setTimeout(removeShowClass, 6000);
        refreshCartNumber(userId)
        try {
            refreshDetailButtons(productId, userId);
        } catch (err) {
            console.log(err)
        }
    } else {

        if (!notificationAlert.classList.contains("active")) {
            notificationTexto.innerText = "El producto ya se encuentra en el carrito"
            notificationAlert.classList.add("info", "show", "active")
            notificationAlert.classList.remove("success", "danger", "hidde-alert")
            notificationIcono.classList.add("fa-circle-info")
            notificationIcono.classList.remove("fa-check", "fa-circle-exclamation")
            if (modalTimer) window.clearTimeout(modalTimer);
            modalTimer = window.setTimeout(removeShowClass, 6000);
        }
        console.log("YA EXISTE EL PRODUCTO EN EL CARRITO")
    }
    return (carrito.length)
}

function removerProducto(productId, userId) {
    const localData = localStorage.getItem("carrito");
    const localDataParsed = localData ? JSON.parse(localData) : {};

    let carrito = localDataParsed[userId] ?? [];
    const notificationAlert = document.querySelector("#notificationAlert")
    const notificationTexto = document.querySelector("#notificationAlert .alert-msg")
    const notificationIcono = document.querySelector("#notificationAlert #notificationIcon")

    const productIndex = carrito.indexOf(productId)
    const isProductInCart = productIndex >= 0;

    if (isProductInCart) {
        carrito.splice(productIndex, 1);
        localDataParsed[userId] = carrito;
        localStorage.setItem("carrito", JSON.stringify(localDataParsed));
        notificationTexto.innerHTML = "El producto se removio del carrito <b>correctamente</b>"
        notificationAlert.classList.add("info", "show", "active")
        notificationAlert.classList.remove("success", "danger", "hidde-alert")
        notificationIcono.classList.add("fa-circle-info")
        notificationIcono.classList.remove("fa-check", "fa-circle-exclamation")
        if (modalTimer) window.clearTimeout(modalTimer);
        modalTimer = window.setTimeout(removeShowClass, 6000);
        refreshCartNumber(userId)
        try {
            refreshDetailButtons(productId, userId);
        } catch (err) {
            console.log(err)
        }
    } else {

        if (!notificationAlertRef.classList.contains("active")) {
            const notificationAlert = document.querySelector("#notificationAlert")
            const notificationTexto = document.querySelector("#notificationAlert b")
            notificationTexto.innerText = "El producto no se encuentra en el carrito"
            notificationAlert.classList.add("danger", "show", "active")
            notificationAlert.classList.remove("success", "info", "hidde-alert")
            notificationIcono.classList.add("fa-circle-exclamation")
            notificationIcono.classList.remove("fa-check", "fa-circle-info")
            if (modalTimer) window.clearTimeout(modalTimer);
            modalTimer = window.setTimeout(removeShowClass, 6000);
        }
        console.log("NO EXISTIA EN EL CARRITO => NO SE HI>O NADA")
    }
    return (carrito.length)

}