function start(){

    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', (event) => {
            apiEdit();
    });

    loadInput();

    function apiEdit(){
        axios.post(
            api.alumno.perfil,
            getData(),
            getHeader()
        ).then(function (response) {
            if (response.status == 200) {
                alert("Datos cargados correctamente");
                window.location.href = "../home.html";
            }
        }).catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        })
    }

    function getData() {
        return {
            "email": document.getElementById("email").value,
            "password": document.getElementById("password").value,
            "password_confirmation": document.getElementById("password").value,
            "direccion": document.getElementById("address").value,
            "telefono": document.getElementById("phonenumber").value,
        }
    }

    function loadInput(){
        axios.get(api.alumno.perfil, getHeader())
        .then(function (response){
            if(response.status == 200){
                let data = response.data.user;
                document.getElementById("email").value = data.email;
                document.getElementById("password").value = null;
                document.getElementById("address").value = data.direccion;
                document.getElementById("phonenumber").value = data.telefono;
            }
        })
        .catch(function (error) {
            if(error.response)
            alert("Error: "+ error.response.data.message);
            else
            alert("Error: No se pudo comunicar con el sistema")
        });
    }
}

window.onload = function(){
    checkToken(['alumno','admin'], start);
}
