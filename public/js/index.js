// BANNER - IMAGE SLIDER

var indexValue = 1;
showImg(indexValue);

function btn_slide(e){
    showImg(indexValue = e);
}

function side_slide(e){
    showImg(indexValue += e);
}

function showImg(e){
    var i;
    const img = document.querySelectorAll('.images img');
    const sliders = document.querySelectorAll('.btn-sliders span');

    if (e > img.length){
        indexValue = 1
    }

    if (e < 1){
        indexValue = img.length
    }

    for (i=0; i < img.length; i++){
        img[i].style.display = "none"
    }
    for (i=0; i < img.length; i++){
        sliders[i].style.background = "rgba(255, 255, 255, .2)"
    }

    img[indexValue-1].style.display = "block";
    sliders[indexValue-1].style.background = "white";
}


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