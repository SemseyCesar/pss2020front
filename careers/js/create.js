window.onload = function(){
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
        axios.post('https://pss2020api.herokuapp.com/api/carrera',
            {   
                "nombre": document.getElementById('careerName').value,
                "identificador": document.getElementById('careerCode').value,
                "dpto": document.getElementById('careerDepartment').value,
                "docente": document.getElementById('careerProfessor').value,
                "duracion": document.getElementById('careerRuntime').value,
                "materias": materiasSelected,
            }
        ).then(function (response) {
            document.getElementById('careerName').value="";
            document.getElementById('careerCode').value="";
            document.getElementById('careerDepartment').value="";
            document.getElementById('careerProfessor').value="";
            document.getElementById('careerRuntime').value="";
            document.getElementById('signatureList').innerHTML = '';
            alert("Datos cargados correctamente");
        }).catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else 
            alert("Error: No se pudo comunicar con el sistema")
            });
        });


    axios.post('https://pss2020api.herokuapp.com/api/materia/search',
        {
            "search": "",
        }
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
}

