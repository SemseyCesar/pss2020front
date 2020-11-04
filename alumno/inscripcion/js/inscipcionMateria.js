function start(){

    var carreras = [];
    let selectCarrera = document.getElementById('selectCarrera');
    axios.get(api.alumno.carrera, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                carreras = response.data.carreras;
                console.log(carreras);
                response.data.carreras.forEach( u => {
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["id"]);
                    let text = document.createTextNode(u["nombre"]);
                    option.appendChild(text);
                    selectCarrera.appendChild(option);
                    onChangeCarreraSelected(selectCarrera.value)
                });
            }
    });


    function onChangeCarreraSelected(id){
        let carreraSelected = carreras.filter(c => c.id ==id)[0];
        document.getElementById('selectMateria').innerHTML = "";
        carreraSelected.materias.forEach( m => {
            let option = document.createElement("OPTION");
            option.setAttribute("id", "option-"+m["id"]);
            option.setAttribute("value", m["id"]);
            let text = document.createTextNode(m["nombre"]);
            option.appendChild(text);
            document.getElementById('selectMateria').appendChild(option);
        });
    }

    selectCarrera.addEventListener('change', (e) =>{
        onChangeCarreraSelected(selectCarrera.value);
    });

    let btnSuccess = document.getElementById('btn-inscribir');
    btnSuccess.addEventListener('click', (e) => {
        axios.post(api.materia.inscripcion,{
            "materia_id": document.getElementById('selectMateria').value
        }, getHeader()).then(function(response) {
            if(response.status == 200){
                alert("Inscripcion Exitosa");
            }
        }).catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        })
    });
}

window.onload = function(){
    checkToken(['admin','docente','alumno'], start);
}
