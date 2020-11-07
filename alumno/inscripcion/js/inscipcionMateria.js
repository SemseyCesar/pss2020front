
function table(){
    var materiasInscripto = []

    let table = new Table('signatureList',['Codigo','Nombre','Departamento',''],
    ['identificador','nombre','dpto'], null);
    table.setWidths(['25%','25%','25%']);

    table.setOnDeleteEvent((id)=>{
        axios.delete(api.materia.inscripcion+"/"+id, getHeader())
            .then((response) => {if(response.status == 200){
                loadMaterias();
                }}
            );
    })

    table.setOnEditEvent((id) =>{
    })

    function loadMaterias(){
        axios.get(api.materia.materia, getHeader())
        .then((response) => {
            if(response.status == 200){
                materiasInscripto = response.data.materias;
                table.refreshSelected(materiasInscripto);
                $( ".btn.btn-outline-warning").addClass("d-none");
            }
        });
    }

    let btnSuccess = document.getElementById('btn-inscribir');
    btnSuccess.addEventListener('click', (e) => {
        axios.post(api.materia.inscripcion,{
            "materia_id": document.getElementById('selectMateria').value
        }, getHeader()).then(function(response) {
            if(response.status == 200){
                alert("Inscripcion Exitosa");
                loadMaterias();
            }
        }).catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        })
    });

    loadMaterias();
}

function start(){
    var carreras = [];

    let selectCarrera = document.getElementById('selectCarrera');
    axios.get(api.alumno.carrera, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                carreras = response.data.carreras;
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

    table();

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
}

window.onload = function(){
    checkToken(['admin','docente','alumno'], start);
}
