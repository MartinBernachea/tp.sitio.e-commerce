window.addEventListener("load", () => {
    notificationAlertRef.classList.add("active");
    modalTimer = window.setTimeout(removeShowClass, 6000);
})