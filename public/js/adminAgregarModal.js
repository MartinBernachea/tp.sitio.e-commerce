const adminAgregarModal = document.querySelector("#adminAgregarModal");
let formLoading = false;

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

const hiddeModal = () => {
    const modalRef = document.querySelector(`#modalAgregar`);
    const modalContainer = modalRef.parentElement;
    if (modalContainer.classList.contains("show-modal")) modalContainer.classList.remove("show-modal")
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

    modalRef.parentElement.classList.add("show-modal");
}

adminAgregarModal.addEventListener("click", async (event) => {
    if (!formLoading) {
        if (event.target.id == "btnShow") {
            showModal();
            return
        }

        if (event.target.classList.contains("btnCancelar")) {
            event.preventDefault();
            hiddeModal()
            // modalData.restoreInitialValues();
            return
        }

        if (event.target.classList.contains("btnAplicar")) {
            event.preventDefault();
            const nombre = document.querySelector("#nombre")
            const params = { nombre: nombre.value };

            if (importedScript) {
                try {
                    const response = await importedScript(params);
                    if (response.error) throw new Error(response.message)
                    location.reload();
                } catch (err) {
                    document.querySelector("#errorMessageModal").innerText = err.message
                }
            }
            return
        }

        if (event.target.id == "modalBackground") {
            hiddeModal()
            // modalData.restoreInitialValues();
            return
        }
    }
})