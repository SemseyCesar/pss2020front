function start(){
    axios.get(api.carrera.carrera, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                response.data.carreras.forEach( u => {
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["id"]);
                    let text = document.createTextNode(u["nombre"]);
                    option.appendChild(text);
                    document.getElementById('selectCarrera').appendChild(option);
                });
            }
    });

    let btnSuccess = document.getElementById('btn-inscribir');
    btnSuccess.addEventListener('click', (e) => {
        axios.post(api.carrera.inscripcion,{
            "carrera_id": document.getElementById('selectCarrera').value
        }, getHeader())
    });
}

window.onload = start