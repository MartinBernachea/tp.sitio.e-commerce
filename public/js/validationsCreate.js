const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{4,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}


window.addEventListener("load", function(){
    
    let formulario = document.getElementById("register");
    let inputs = document.querySelectorAll("#register input")

    const validarFormulario = function(e){
        switch(e.target.name){
            case "cName":
                validarCampo(expresiones.nombre, e.target, "nombre");
            break;
            case "cLastName":
                validarCampo(expresiones.nombre, e.target, "nombre")
            break;
            case "email":
                validarCampo(expresiones.correo, e.target, "correo")
            break;
            case "password":
            
            break;
            case "cPassword":
            
            break;
        }
    }

    const validarCampo = (expresion, input, campo) => {
        if(expresion.test(input.value)){
            document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
            document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
            document.querySelector(`#grupo__${campo} i`).classList.remove("fa-times-circle");
            document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
            document.querySelector(`#grupo__${campo} .input-text-error`).classList.remove("input-text-error-activo");
        }else {
            document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__${campo} i`).classList.add("fa-times-circle");
            document.querySelector(`#grupo__${campo} .input-text-error`).classList.add("input-text-error-activo");
        }
    }


    inputs.forEach((input) => {
        input.addEventListener("keyup", validarFormulario);
        input.addEventListener("blur", validarFormulario);   
    })    

    formulario.addEventListener("submit", function(e){
        e.preventDefault();

        let errores = [];

        let nombre = document.querySelector("input#cName");

        if (nombre.value == ""){
            errores.push("Debes completar el nombre");
        }

        let apellido = document.querySelector("input#cLastName");

        if (apellido.value == ""){
            errores.push("Debes completar el apellido");
        }

        let email = document.querySelector("input#email");
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/


        if (email.value == ""){
            errores.push("Debes completar el mail");
        }

        if (!regexEmail.test(email.value)){
            errores.push("El mail ingresado no es valido")
        }        

        let password = document.querySelector("innput#password");

        if (password.value == ""){
            errores.push("Debes completar la contraseña");
        }

        if (password.value.length < 6){
            errores.push("Contraseña muy corta")
        }

        let cPassword = document.querySelector("innput#cPassword");

        if (cPassword.value != password.value){
            errores.push("Las contraseñas no coinciden");
        }

        if (errores.length > 0){
            e.preventDefault();

        let ulErrores = document.querySelector("")    

        } else {
            formulario.submit
        }

    })
})