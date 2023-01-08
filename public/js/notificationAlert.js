const notificationAlertRef = document.querySelector("#notificationAlert");

let modalTimer;

notificationAlertRef?.addEventListener("click", (event) => {
    if (event.target.id == "btn-close-alert") {
        window.clearTimeout(modalTimer);
        notificationAlertRef.classList.add("hidde-alert")
    }
})

const removeShowClass = () => {
    notificationAlertRef.classList.remove("show");
    notificationAlertRef.classList.remove("active");
    window.clearTimeout(modalTimer);
}

notificationAlertRef?.addEventListener("mouseenter", (event) => {
    window.clearTimeout(modalTimer);
    notificationAlertRef.classList.toggle("active");
})

notificationAlertRef?.addEventListener("mouseleave", (event) => {
    modalTimer = window.setTimeout(removeShowClass, 6000);
    notificationAlertRef.classList.toggle("active");
})

