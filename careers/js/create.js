function start(){
    const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;

    if(edit){loadInput(_id)}

    var materiasSelected = [];

    let table = new Table('materias',['Nombre','Año','Cuatrimestre',''],
        ['id','nombre','anio','cuatrimestre'], null);
    table.setWidths(['33%','25%','25%','16%']);

    let addMateria = document.getElementById('addMateria');
    addMateria.addEventListener('click', (event) =>{
        let id = document.getElementById('selectMateria').value;

        if (localValidateSignature(materiasSelected)) {
            materiasSelected.push({
                "id": id,
                "nombre": document.getElementById('option-'+id).text,
                "anio": document.getElementById('anio').value,
                "cuatrimestre": document.getElementById('selectCuatrimestre').value,
            });
            table.refreshSelected(materiasSelected);
        }
    })

    table.setOnDeleteEvent((id)=>{
        materiasSelected  = materiasSelected.filter(e => e.id != id);
        table.refreshSelected(materiasSelected);
    })

    table.setOnEditEvent((id) =>{
        openModalEdit(materiasSelected.filter(e => e.id==id)[0]);
    })

    let addCarrera = document.getElementById('addCarrera');
    addCarrera.addEventListener('click', (event) => {
        if(!edit)
            apiCreate();
        else
            apiEdit();
    });

    axios.get(api.user.docentes,getHeader()
        ).then(function (response) {
            if(response.status == 200){
                response.data.docentes.forEach( u => {
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["nombre_apellido"]);
                    let text = document.createTextNode(u["nombre_apellido"]);
                    option.appendChild(text);
                    document.getElementById('selectProfessor').appendChild(option);
                });
            }
    });

    axios.post(api.materia.search,
        {
            "search": "",
        },getHeader()
        ).then(function (response) {
            if(response.status == 200){
                response.data.materias.forEach( u => {
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["id"]);
                    let text = document.createTextNode(u["nombre"]);
                    option.appendChild(text);
                    document.getElementById('selectMateria').appendChild(option);
                });
            }
    });

    function openModalEdit(data){
        let modal = $('#editModal')
        modal.find('#modal-materia').val(data.nombre);
        modal.find('#modal-anio').val(data.anio);
        modal.find('#modal-cuatrimestre').val(data.cuatrimestre);
        modal.modal('show');
        modal.find('#btn-modal-success').click( function (event){
            let index = materiasSelected.findIndex(e => e.id == data.id);
            materiasSelected[index] = {
                "id": data.id,
                "nombre": modal.find('#modal-materia').val(),
                "anio": modal.find('#modal-anio').val(),
                "cuatrimestre": modal.find('#modal-cuatrimestre').val(),
            }
            modal.modal('hide');
            table.refreshSelected(materiasSelected);
            modal.find('#btn-modal-success').off('click');
        })
    }

    function loadInput(id){
        axios.get(api.carrera.carrera+"/"+id, getHeader())
        .then(function (response){
            if(response.status == 200){
                data = response.data.carrera;
                document.getElementById('careerName').value = data.nombre;
                document.getElementById('careerCode').value = data.identificador;
                document.getElementById('selectDepartamento').value = data.dpto,
                document.getElementById('selectProfessor').value = data.docente;
                document.getElementById('careerRuntime').value = data.duracion;
                materiasSelected = data.materias.map( m => {
                    return {
                        "id": m.id,
                        "nombre": m.nombre,
                        "anio": m.pivot.anio,
                        "cuatrimestre": m.pivot.cuatrimestre,
                    }
                });
                table.refreshSelected(materiasSelected);
            }
        })
        .catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        });
    }

    function refreshInputs(){
        document.getElementById('careerName').value="";
        document.getElementById('careerCode').value="";
        //document.getElementById('selectDepartamento').value="";
        //document.getElementById('selectDepartamento').value="";
        document.getElementById('careerRuntime').value="";
        materiasSelected = [];
        table.refreshSelected(materiasSelected);
        alert("Datos cargados correctamente");
    }

    function getDataToSend(){
        return {
            "nombre": document.getElementById('careerName').value,
            "identificador": document.getElementById('careerCode').value,
            "dpto": document.getElementById('selectDepartamento').value,
            "docente": document.getElementById('selectProfessor').value,
            "duracion": document.getElementById('careerRuntime').value,
            "materias": materiasSelected,
        }
    }

    function apiCreate(){
        if (localValidate()) {
            axios.post(api.carrera.carrera,
                getDataToSend(), getHeader()
            ).then(function (response){
                if(response.status == 200){
                    refreshInputs();
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            });
        }
    }

    function apiEdit(){
        if (localValidate()){
            axios.put(api.carrera.carrera+"/"+_id,
                getDataToSend() , getHeader()
            ).then(function (response){
                if(response.status == 200){
                    refreshInputs();
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            });
        }
    }
}

window.onload = function(){
    checkToken(['admin'], start);
}
