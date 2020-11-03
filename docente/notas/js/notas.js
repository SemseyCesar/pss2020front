function start(){

    var materias = [];
    var alumnos = [];
    let selectMateria = document.getElementById('selectMateria');
    let selectAlumno = document.getElementById('selectAlumno');
    let btnCambiarNota = document.getElementById('btn-cambiar-nota');

    function loadMaterias(){
        axios.get(api.profesor.materia, getHeader()
            ).then(function (response) {
                selectMateria.innerHTML="";
                materias=[];
                if(response.status == 200){
                    materias = response.data.materias;
                    response.data.materias.forEach( u => {
                        let option = document.createElement("OPTION");
                        option.setAttribute("id", "option-"+u["id"]);
                        option.setAttribute("value", u["id"]);
                        let text = document.createTextNode(u["nombre"]);
                        option.appendChild(text);
                        selectMateria.appendChild(option);       
                    });
                    onChangeMateriaSelected(selectMateria.value);
                }
        });
    }

    loadMaterias();   
    
    function onChangeMateriaSelected(id){
        let materiaSelected = materias.filter(c => c.id ==id)[0];
        selectAlumno.innerHTML = "";
        alumnos = materiaSelected.anotados;
        materiaSelected.anotados.forEach( m => {
            let option = document.createElement("OPTION");
            option.setAttribute("id", "option-"+m["id"]);
            option.setAttribute("value", m["id"]);
            let text = document.createTextNode("(" + m["legajo"]+ ") "+m["nombre_apellido"]);
            option.appendChild(text);
            selectAlumno.appendChild(option);
        });
        onChangeAlumnoSelected(selectAlumno.value);
    }

    function onChangeAlumnoSelected(id){
        let alumnoSelected = alumnos.filter(c => c.id ==id)[0];
        let nota_cursado = null;
        let nota_final = null;
        if(alumnoSelected){
            nota_cursado= alumnoSelected.pivot.nota_cursado;
            nota_final = alumnoSelected.pivot.nota_final;
            enableButton(alumnoSelected)
        }else{
            disableButton()
        }
        document.getElementById('notaCursado').value = nota_cursado ? nota_cursado : "Sin Calificar";
        document.getElementById('notaFinal').value = nota_final ? nota_final : "Sin Calificar";
    }
        
    selectMateria.addEventListener('change', (e) =>{
        onChangeMateriaSelected(selectMateria.value);
    });

    selectAlumno.addEventListener('change', (e) =>{
        onChangeAlumnoSelected(selectAlumno.value);
    });

    function enableButton(alumno){
        removeEventListener();
        btnCambiarNota.disabled = false;
        btnCambiarNota.addEventListener('click', () => {
            openModalEdit(alumno)
        })
    }
    function disableButton(){
        btnCambiarNota.disabled = true;
        removeEventListener();
    }

    function removeEventListener(){
        btnCambiarNota.outerHTML = btnCambiarNota.outerHTML;
        btnCambiarNota = document.getElementById('btn-cambiar-nota');
    }



    function openModalEdit(alumno){
        let modal = $('#editModal')
        console.log(alumno.pivot);
        modal.find('#modal-nota-cursado').val(alumno.pivot.nota_cursado ? alumno.pivot.nota_cursado : "Sin calificar");
        modal.find('#modal-nota-final').val(alumno.pivot.nota_final ? alumno.pivot.nota_final : "Sin calificar");
        modal.modal('show');
        modal.find('#btn-modal-success').click( function (event){
            modal.find('#btn-modal-success').off('click');
            let nota_cursado = modal.find('#modal-nota-cursado').val();
            let nota_final = modal.find('#modal-nota-final').val();
            axios.post(api.profesor.nota, {
                "materia_id": alumno.pivot.materia_id,
                "alumno_id": alumno.id,
                "nota_final": nota_final,
                "nota_cursado": nota_cursado
            }, getHeader()).then( function(response){
                if(response.status == 200){
                    loadMaterias();
                    modal.modal('hide');
                }else{
                    modal.modal('hide');
                }
            });
            
        })
    }
}

window.onload = function(){
    checkToken(['admin','docente'], start);
}