// IMAGE UPLOAD

function previewBeforeUpload(id) {
    document.querySelector("#" + id).addEventListener("change", function (e) {
        if (e.target.files.lenght == 0) {
            return;
        }
        let file = e.target.files[0];
        let url = URL.createObjectURL(file);
        document.querySelector("#" + id + "-preview div").innerText = file.name;
        document.querySelector("#" + id + "-preview img").src = url;
    })
}

previewBeforeUpload("cImage1");
previewBeforeUpload("cImage2");
previewBeforeUpload("cImage3");
previewBeforeUpload("cImage4");
previewBeforeUpload("cImage5");

// SUBMIT BUTTON    

const submitButton = document.querySelector("#submitButton")

submitButton.addEventListener("click", (event) => {
    // event.preventDefault();

    console.log("CLICK")

})