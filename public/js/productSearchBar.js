import { getProductsLike } from "./service/getProductsLike.js";


const searchBarInput = document.querySelector("#searchBarInput")
const searchBarSpinner = document.querySelector("#searchBarSpinner")

searchBarInput.addEventListener("keyup", async (e) => {
    if (e.target.value.length >= 3) {
        searchBarSpinner.style.display = "block";
        setTimeout(() => {
            searchBarSpinner.style.display = "none";
        }, 2000)
        await getProductsLike({ nombre: e.target.value });
        
    }
    console.log("cambiamos texto")
})