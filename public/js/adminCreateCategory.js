const adminCreateCategotyModal = document.querySelector("#admin-create-category-modal");

adminCreateCategotyModal.addEventListener("click", (event) => {
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
})