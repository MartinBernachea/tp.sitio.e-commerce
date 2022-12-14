window.addEventListener("load", () => {
    const paginationElement = document.querySelector(".pagination-container");
    paginationElement.addEventListener("click", (e) => {
        let pageNumber;

        if (e.target.tagName == "I" && e.target.parentElement.tagName == "BUTTON") {
            pageNumber = e.target.parentElement.value
        }

        if (e.target.tagName == "BUTTON" || e.target.tagName == "INPUT") {
            pageNumber = e.target.value
        }

        if (pageNumber) {
            const url = new URL(location);
            url.searchParams.set('Page', pageNumber);
            location.href = url.href;
        }
    })
})