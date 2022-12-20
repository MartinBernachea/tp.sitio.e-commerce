import { editCategory } from "./service/editCategory.js";
import { editBrand } from "./service/editBrand.js";

const adminTable = document.querySelector("table");
let formLoading = false;

let modalData = {
    stored: {},
    getModalData: (modalId) => {
        let currentData = {};
        const formInputs = document.querySelectorAll(`#adminEditar${modalId} input`)
        const formSelects = document.querySelectorAll(`#adminEditar${modalId} select`)
        const formElements = [...formInputs, ...formSelects]
        formElements.forEach(ctElement => {
            currentData = {
                ...currentData
                , [ctElement.name]: ctElement.value
            }
        })
        return currentData;
    },

    saveInitialValues: (modalId) => {
        modalData.stored = modalData.getModalData(modalId);
        console.log("data", modalData.stored)
    },

    restoreInitialValues: (modalId) => {
        const formInputs = document.querySelectorAll(`#adminEditar${modalId} input`)
        const formSelects = document.querySelectorAll(`#adminEditar${modalId} select`)
        const formElements = [...formInputs, ...formSelects]
        formElements.forEach(ctElement => ctElement.value = modalData.stored[ctElement.name])
        modalData.clear();
    },
    clear: () => {
        modalData.stored = {}
    }
}

const hiddeModal = (id) => {
    const modalRef = document.querySelector("#modalEditar" + id);
    const modalContainer = modalRef.parentElement;
    if (modalContainer.classList.contains("show-modal")) modalContainer.classList.remove("show-modal")
    modalData.restoreInitialValues(id)
}

const showModal = (id) => {
    modalData.saveInitialValues(id)

    const modalRef = document.querySelector("#modalEditar" + id);
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

    modalRef.parentElement.classList.add("show-modal");
}

adminTable.addEventListener("click", async (event) => {
    console.log(event.target.id)

    if (!formLoading) {
        const extraerNumeroId = (prefijo, nombreEntero) => {
            return nombreEntero.slice(prefijo.length, nombreEntero.length)
        }

        if (event.target.id.includes("btnShowEditar")) {
            showModal(extraerNumeroId("btnShowEditar", event.target.id));
            return
        }

        if (event.target.id.includes("btnCancelEditar")) {
            event.preventDefault();
            hiddeModal(extraerNumeroId("btnCancelEditar", event.target.id))
            return
        }

        if (event.target.id.includes("btnSuccessEditar")) {
            event.preventDefault();
            const nombre = document.querySelector(`#modalEditar${extraerNumeroId("btnAplicarEditar", event.target.id)} #nombre`)
            const params = { nombre: nombre.value, id: extraerNumeroId("btnAplicarEditar", event.target.id) };

            let editFunction;
            if (location.href.includes("categories")) editFunction = editCategory;
            if (location.href.includes("genres")) editFunction = editCategory;
            if (location.href.includes("brands")) editFunction = editCategory;

            if (editFunction) {
                try {
                    const response = await editFunction(params);
                    if (response.error) throw new Error(response.message)
                    location.reload();
                } catch (err) {
                    document.querySelector(`#modalEditar${extraerNumeroId("btnAplicarEditar", event.target.id)} #errorMessageModal`).innerText = err.message;
                }
            }
            return
        }

        if (event.target.id.includes("modalBackgroundEditar")) {
            hiddeModal(extraerNumeroId("modalBackgroundEditar", event.target.id))
            return
        }
    }
})