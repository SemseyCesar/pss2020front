function start(){

    var materias = [];
    var alumnos = [];
    let selectMateria = document.getElementById('selectMateria');
    let selectAlumno = document.getElementById('selectAlumno');
    let btnCambiarNota = document.getElementById('btn-cambiar-nota');
    axios.get(api.profesor.materia, getHeader()
        ).then(function (response) {
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
            console.log(alumno)
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

    let btnSuccess = document.getElementById('btn-inscribir');
    // btnSuccess.addEventListener('click', (e) => {
    //     axios.post(api.materia.inscripcion,{
    //         "materia_id": document.getElementById('selectMateria').value
    //     }, getHeader())
    // });
}

window.onload = start