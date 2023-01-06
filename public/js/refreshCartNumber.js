export const refreshCartNumber = (userId) => {
    const localData = localStorage.getItem("carrito");
    const localDataParsed = localData ? JSON.parse(localData) : {};
    const cartNumber = document.querySelector("#cartNumber")

    const hiddeCartNumber = () => cartNumber.style.display = "none";
    const showCartNumber = (n) => {
        cartNumber.innerText = n;
        cartNumber.style.display = "flex";
    }

    if (localDataParsed[userId] && localDataParsed[userId].length > 0) {
        const n = localDataParsed[userId].length < 99 ? localDataParsed[userId].length : "+"
        showCartNumber(n)
    } else {
        hiddeCartNumber();
    }
}