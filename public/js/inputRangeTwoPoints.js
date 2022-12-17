let lowerSlider = document.querySelector('#lower');
let upperSlider = document.querySelector('#upper');
let lowerVal = parseInt(lowerSlider.value);
let upperVal = parseInt(upperSlider.value);
let lowerLabel = document.querySelector("#lowerLabel")
let upperLabel = document.querySelector("#upperLabel")

upperSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (upperVal < lowerVal + 4) {
        lowerSlider.value = upperVal - 4;
        
        if (lowerVal == lowerSlider.min) {
            upperSlider.value = 4;
        }
    }
    lowerLabel.innerHTML = `$${lowerSlider.value}`;
    upperLabel.innerHTML = `$${upperSlider.value}`;
};

lowerSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (lowerVal > upperVal - 4) {
        upperSlider.value = lowerVal + 4;

        if (upperVal == upperSlider.max) {
            lowerSlider.value = parseInt(upperSlider.max) - 4;
        }

    }
    lowerLabel.innerHTML = `$${lowerSlider.value}`;
    upperLabel.innerHTML = `$${upperSlider.value}`;
};
