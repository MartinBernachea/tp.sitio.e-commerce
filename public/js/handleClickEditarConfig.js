import { editConfig } from "./service/editConfig.js";

let modalData = {
    stored: {},
    getModalData: (modalId) => {
        let currentData = {};
        const formInputs = document.querySelectorAll(`#${modalId} input`)
        const formSelects = document.querySelectorAll(`#${modalId} select`)
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
    },

    restoreInitialValues: (modalId) => {
        const formInputs = document.querySelectorAll(`#${modalId} input`)
        const formSelects = document.querySelectorAll(`#${modalId} select`)
        const formElements = [...formInputs, ...formSelects]
        formElements.forEach(ctElement => {
            ctElement.value = modalData.stored[ctElement.name]
        })
        modalData.clear();
    },
    clear: () => {
        modalData.stored = {}
    }
}

const resultsTable = document.querySelector("table")

const hiddeCurrentModal = (id) => {
    const modalRef = document.querySelector(`#editConfigmodal${id}`);
    const modalContainer = modalRef.parentElement;
    if (modalContainer.classList.contains("show-modal")) modalContainer.classList.remove("show-modal")
    modalData.restoreInitialValues(`editConfigmodal${id}`)
}

const showCurrentModal = (id) => {
    modalData.saveInitialValues(`editConfigmodal${id}`)

    const modalRef = document.querySelector(`#editConfigmodal${id}`);
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
const extraerNumeroId = (prefijo, nombreEntero) => {
    return nombreEntero.slice(prefijo.length, nombreEntero.length)
}

if (resultsTable) {
    resultsTable.addEventListener("click", async (event) => {
        event.preventDefault();
        if (event.target.id.includes("btnShowEdit-modal")) {
            showCurrentModal(extraerNumeroId("btnShowEdit-modal", event.target.id))
            return
        }

        if (event.target.id.includes("btnAplicar-modal")) {
            event.preventDefault();

            const valor = document.querySelector(`#editConfigmodal${extraerNumeroId("btnAplicar-modal", event.target.id)} #valor`)
            const params = { valor: valor.value, id: extraerNumeroId("btnAplicar-modal", event.target.id) };

            try {
                const response = await editConfig(params);
            } catch (err) {
                console.log(err)
            } finally {
                location.reload();
            }

            return
        }

        if (event.target.id.includes("btnCancelar-modal")) {
            event.preventDefault();
            hiddeCurrentModal(extraerNumeroId("btnCancelar-modal", event.target.id))
            return
        }

        if (event.target.id.includes("modalBackground")) {
            hiddeCurrentModal(extraerNumeroId("modalBackground", event.target.id))
            return
        }
    })
}

