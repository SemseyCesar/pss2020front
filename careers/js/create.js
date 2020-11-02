window.onload = function(){

    const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;
    console.log(edit, _id);

    if(edit){loadInput(_id)}

    var materiasSelected = [];

    let table = new Table('materias',['Nombre','Año','Cuatrimestre',''],
        ['id','nombre','anio','cuatrimestre'], null);
    table.setWidths(['33%','25%','25%','16%']);

    let addMateria = document.getElementById('addMateria');
    addMateria.addEventListener('click', (event) =>{
        let id = document.getElementById('selectMateria').value;

        if(materiasSelected.filter(e => e.id == id).length > 0)
        return;
        materiasSelected.push({
            "id": id,
            "nombre": document.getElementById('option-'+id).text,
            "anio": document.getElementById('anio').value,
            "cuatrimestre": document.getElementById('selectCuatrimestre').value,
        });
        table.refreshSelected(materiasSelected);
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
/*
    function getProfessors() {
        axios.post('https://pss2020api.herokuapp.com/api/user/search',
            {
                "search": "",
            }).then(function (response) {
                if(response.status == 200) {
                    professors = response.data.users.filter(item => item['type'] == "docente");
                    let select = document.getElementById("careerProfessor");
                    professors.forEach(p => {
                        let option = document.createElement("option");
                        option.setAttribute("value", ""+p['id']);
                        option.textContent = p['nombre_apellido'];
                        select.appendChild(option);
                    })
                }
            })
    } */

    function loadInput(id){
        axios.get(api.carrera.carrera+id, getHeader())
        .then(function (response){
            if(response.status == 200){
                data = response.data.carrera;
                document.getElementById('careerName').value = data.nombre;
                document.getElementById('careerCode').value = data.identificador;
                document.getElementById('careerDepartment').value = data.dpto,
                document.getElementById('careerProfessor').value = response.docente;
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
        document.getElementById('careerDepartment').value="";
        document.getElementById('careerProfessor').value="";
        document.getElementById('careerRuntime').value="";
        materiasSelected = [];
        table.refreshSelected(materiasSelected);
        alert("Datos cargados correctamente");
    }

    function getDataToSend(){
        return {
            "nombre": document.getElementById('careerName').value,
            "identificador": document.getElementById('careerCode').value,
            "dpto": document.getElementById('careerDepartment').value,
            "docente": document.getElementById('careerProfessor').value,
            "duracion": document.getElementById('careerRuntime').value,
            "materias": materiasSelected,
        }
    }

    function apiCreate(){
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

    function apiEdit(){
        axios.put(api.carrera.carrera+_id,
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
