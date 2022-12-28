const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}

const campos = {
    nombre: false,
    apellido: false,
    correo: false,
    password: false,
}

window.addEventListener("load", function () {

    let formulario = document.getElementById("register");
    let inputs = document.querySelectorAll("#register input");
    let btnRegistrarse = document.querySelector("#btnRegistrarse");

    const mensajeError = document.getElementById("formulario__mensaje");

    const inputPassword1 = document.getElementById("password");
    const inputPassword2 = document.getElementById("cPassword");

    const validarFormulario = function (e) {
        switch (e.target.name) {
            case "cName":
                validarCampo(expresiones.nombre, e.target, "nombre");
                break;
            case "cLastName":
                validarCampo(expresiones.nombre, e.target, "apellido")
                break;
            case "email":
                validarCampo(expresiones.correo, e.target, "correo")
                break;
            case "password":
                validarCampo(expresiones.password, e.target, "password")
                validarContraseña2();
                break;
            case "cPassword":
                validarContraseña2();
                break;
        }
    }

    const validarCampo = (expresion, input, campo) => {
        mensajeError.classList.remove("formulario__mensaje-activo");


        if (expresion.test(input.value)) {
            document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
            document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
            document.querySelector(`#grupo__${campo} i`).classList.remove("fa-times-circle");
            document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
            document.querySelector(`.grupo__${campo}.input-text-error`).classList.remove("input-text-error-activo");
            campos[campo] = true;
        } else {
            document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__${campo} i`).classList.add("fa-times-circle");
            document.querySelector(`.grupo__${campo}.input-text-error`).classList.add("input-text-error-activo");
            campos[campo] = false;
        }
    }

    const validarContraseña2 = function () {
        mensajeError.classList.remove("formulario__mensaje-activo");

        if (inputPassword1.value !== inputPassword2.value) {
            document.getElementById(`grupo__password2`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__password2 i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__password2 i`).classList.add("fa-times-circle");
            document.querySelector(`.grupo__password2.input-text-error`).classList.add("input-text-error-activo");
            campos["password"] = false;
        } else {
            document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-incorrecto");
            document.getElementById(`grupo__password2`).classList.add("formulario__grupo-correcto");
            document.querySelector(`#grupo__password2 i`).classList.add("fa-check-circle");
            document.querySelector(`#grupo__password2 i`).classList.remove("fa-times-circle");
            document.querySelector(`.grupo__password2.input-text-error`).classList.remove("input-text-error-activo");
            campos["password"] = true;
        }

        if (!inputPassword1.value) {
            document.querySelector(`#grupo__password2 i`).classList.add("fa-times-circle");
            document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__password2 i`).classList.remove("fa-check-circle");
            document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-incorrecto");
        }

    }

    inputs.forEach((input) => {
        input.addEventListener("keyup", validarFormulario);
        input.addEventListener("blur", validarFormulario);
    });

    btnRegistrarse.addEventListener("click", function (e) {
        if (campos.nombre && campos.correo && campos.password && campos.apellido) {
            formulario.submit();
        } else {
            e.preventDefault();
            mensajeError.classList.add("formulario__mensaje-activo");
        }
    });
})