let lowerSlider = document.querySelector('#lower');
let upperSlider = document.querySelector('#upper');
let lowerVal = parseInt(lowerSlider.value);
let upperVal = parseInt(upperSlider.value);
let lowerLabel = document.querySelector("#lowerLabel")
let upperLabel = document.querySelector("#upperLabel")

const unidadEscala = ((lowerSlider.max - lowerSlider.min) / 8);

upperSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (upperVal <= lowerVal + unidadEscala) {
        lowerSlider.value = upperVal - unidadEscala;

        if (lowerVal == lowerSlider.min) {
            upperSlider.value = unidadEscala;
        }
    }
    lowerLabel.innerHTML = `$${lowerSlider.value}`;
    upperLabel.innerHTML = `$${upperSlider.value}`;
};

lowerSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (lowerVal >= upperVal - unidadEscala) {
        upperSlider.value = lowerVal + unidadEscala;

        if (upperVal == upperSlider.max) {
            lowerSlider.value = parseInt(upperSlider.max) - unidadEscala;
        }

    }
    lowerLabel.innerHTML = `$${lowerSlider.value}`;
    upperLabel.innerHTML = `$${upperSlider.value}`;
};
