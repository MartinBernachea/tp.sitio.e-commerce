window.addEventListener("load", function(){
    
    let formulario = document.querySelector("form#register");
    
    formulario.addEventListener("submit", function(e){

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