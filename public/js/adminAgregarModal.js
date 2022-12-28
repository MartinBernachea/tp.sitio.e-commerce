import { createNewBrand } from "./service/createNewBrand.js";
import { createNewCategory } from "./service/createNewCategory.js";
import { createNewGenre } from "./service/createNewGenre.js";

const adminAgregarModal = document.querySelector("#adminAgregar");
let formLoading = false;

const hiddeModal = () => {
    const modalRef = document.querySelector(`#modalAgregar`);
    const modalContainer = modalRef.parentElement;
    if (modalContainer.classList.contains("show-modal")) modalContainer.classList.remove("show-modal")
}

const resetAgregarModalInputs = () => {
    const formInputs = document.querySelectorAll(`#modalAgregar input`)
    const formSelects = document.querySelectorAll(`#modalAgregar select`)
    const formElements = [...formInputs, ...formSelects]
    formElements.forEach(ctElement => ctElement.value = "")
}

const showModal = () => {
    const modalRef = document.querySelector("#modalAgregar");
    /* SOLUCION BUG */
    /* 
    Habian veces donde al cargar la seccion, de forma random, el modal aparecia visible y automaticamente desaparecia:
    El modal inicialmente tiene clase con opacidad 0 y trans de opacidad de 500ms 
    (supongo que el bug se daba porque al iniciar screen aparecia con opacidad 1 y transicionaba a 0, en lugar de iniciar directo con 0).
    Se agrego una clase solo de uso inicial que ubica al modal en una posicion fuera de la screen, para que, si ese evento random sucede, 
    no sea visible
     */
    if (modalRef.parentElement.classList.contains("initial-position")) modalRef.parentElement.classList.remove("initial-position")
    /* SOLUCION BUG */

    resetAgregarModalInputs();

    modalRef.parentElement.classList.add("show-modal");
}

adminAgregarModal.addEventListener("click", async (event) => {
    if (!formLoading) {

        if (event.target.id.includes("btnShowAgregar")) {
            showModal();
            return
        }

        if (event.target.id.includes("btnCancelAgregar")) {
            event.preventDefault();
            hiddeModal()
            return
        }

        if (event.target.id.includes("btnSuccessAgregar")) {
            event.preventDefault();

            const nombre = document.querySelector("#nombre")
            const params = { nombre: nombre.value };

            let editFunction;
            if (location.href.includes("categories")) editFunction = createNewCategory;
            if (location.href.includes("genres")) editFunction = createNewGenre;
            if (location.href.includes("brands")) editFunction = createNewBrand;

            if (editFunction) {
                try {
                    const response = await editFunction(params);
                    if (response.error) throw new Error(response.message)
                    location.reload();
                } catch (err) {
                    document.querySelector("#modalAgregar #errorMessageModal").innerText = err.message;
                }
            }
            return
        }

        if (event.target.id == "modalBackgroundAgregar") {
            hiddeModal()
            return
        }
    }
})