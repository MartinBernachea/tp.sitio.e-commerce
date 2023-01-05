const notificationAlertRef = document.querySelector("#notificationAlert");

notificationAlertRef?.addEventListener("click", (event) => {
    if (event.target.id == "btn-close-alert") {
        notificationAlertRef.classList.add("hidde-alert")
    }
})

const removeShowClass = () => {
    notificationAlertRef.classList.remove("show");
    notificationAlertRef.classList.remove("active");
    window.clearTimeout(modalTimer);
}

let modalTimer;

notificationAlertRef?.addEventListener("mouseenter", (event) => {
    console.log("INGRESO")
    window.clearTimeout(modalTimer);
    notificationAlertRef.classList.toggle("active");
})

notificationAlertRef?.addEventListener("mouseleave", (event) => {
    console.log("SALIO")
    modalTimer = window.setTimeout(removeShowClass, 6000);
    notificationAlertRef.classList.toggle("active");
})

