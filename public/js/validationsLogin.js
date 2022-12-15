window.addEventListener("load", function(){

    let formulario = document.getElementById("register");
    let inputs = document.querySelectorAll("#register input");

    inputs.forEach((input) => {
        input.addEventListener("keyup", validarFormulario);
        input.addEventListener("blur", validarFormulario);   
    });

    formulario.addEventListener("submit", function(e){
        
        if(campos.nombre && campos.correo && campos.password){
            formulario.submit();
        } else{
            e.preventDefault();
            document.getElementById("formulario__mensaje").classList.add("formulario__mensaje-activo");
        }
    });
})