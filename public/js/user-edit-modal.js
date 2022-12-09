const userEditTable = document.querySelector("#user-edit-table");

let modalData = {
    stored: {},
    saveInitialValues: (modalId) => {
        const formInputs = document.querySelectorAll(`#${modalId} input`)
        const formSelects = document.querySelectorAll(`#${modalId} select`)
        const formElements = [...formInputs, ...formSelects]
        console.log("formElements", formElements)
        formElements.forEach(ctElement => {
            modalData.stored = {
                ...modalData.stored
                , [ctElement.name]: ctElement.value
            }
        })
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

const hiddeModal = (modalId) => {
    const modalRef = document.querySelector(`#${modalId}`);
    const modalContainer = modalRef.parentElement;
    if (modalContainer.classList.contains("show-modal")) modalContainer.classList.remove("show-modal")
}

const showModal = (modalId) => {
    const modalRef = document.querySelector("#" + modalId);
    modalRef.parentElement.classList.add("show-modal");
}

const getModalId = (event) => {
    const eventSplitted = event.target.id.split("-");
    return eventSplitted[1];
}

userEditTable.addEventListener("click", (event) => {

    if (event.target.classList.contains("btnShow")) {
        const modalId = getModalId(event);
        modalData.saveInitialValues(modalId);
        showModal(modalId);
        return
    }

    if (event.target.classList.contains("btnCancelar")) {
        event.preventDefault();
        const modalId = getModalId(event);
        hiddeModal(modalId)
        modalData.restoreInitialValues(modalId);
        return
    }

    if (event.target.classList.contains("btnAplicar")) {
        /* TODO: VALIDACIONES DEL FORM */
        if (false) {
            event.preventDefault();
            return;
        }
        return
    }

    if (event.target.id == "modalBackground") {
        const modalId = event.target.firstElementChild.id
        hiddeModal(modalId)
        modalData.restoreInitialValues(modalId);
        return
    }

})
