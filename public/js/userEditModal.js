const userEditTable = document.querySelector("#user-edit-table");
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

const setLoadingModal = (loading, modalId) => {
    const formInputs = document.querySelectorAll(`#${modalId} input`)
    const formSelects = document.querySelectorAll(`#${modalId} select`)
    const formElements = [...formInputs, ...formSelects];
    formElements.forEach(ctElement => ctElement.disabled = true)
    formLoading = loading;
    const arrButtons = document.querySelectorAll(`#${modalId} .buttons-container button`)
    arrButtons.forEach(ctElement => {
        if (loading) {
            ctElement.id == "loader" ? ctElement.style.display = "flex" : ctElement.style.display = "none"
        } else {
            ctElement.id == "loader" ? ctElement.style.display = "none" : ctElement.style.display = "flex"
        }
    })
}

const sendEditUser = async (modalId) => {
    const prefijo = "modal"
    const id = modalId.slice(prefijo.length, modalId.length)
    setLoadingModal(true, modalId);
    try {

        await fetch(window.location.origin + "/user/editUser/" + id, {
            method: 'POST',
            body: JSON.stringify(modalData.getModalData(modalId)),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(response => {
                document.querySelector("#userPanelForm").submit();
                hiddeModal(modalId)
            })

    } catch (err) {
        console.log("err".err)
    } finally { setLoadingModal(false, modalId); }

}

userEditTable.addEventListener("click", (event) => {
    if (!formLoading) {
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
            event.preventDefault();
            const modalId = getModalId(event);
            sendEditUser(modalId)
            return
        }

        if (event.target.id == "modalBackground") {
            const modalId = event.target.firstElementChild.id
            hiddeModal(modalId)
            modalData.restoreInitialValues(modalId);
            return
        }
    }
})
