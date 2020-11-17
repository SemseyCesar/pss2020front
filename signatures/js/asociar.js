function start(auth) {
    if (auth=='admin')
        new NavBar(
            'navId',
            ['Home', 'Usuarios', 'Carreras', 'Materias', 'Exámenes', 'Notas', 'Asociar Doc-Mat'],
            ['../admin/home.html', '../users/index.html', '../careers/index.html', './index.html', '../exams/index.html', '../docente/notas/notas.html', ''],
            "Admin",
            localStorage.getItem('user_name'),
            '../auth/login.html'
        );

    var materias = [];
    var materiaSelected = null;
    let selectMateria = document.getElementById('selectMateria');

    function loadMaterias(){
        axios.get(api.materia.materia, getHeader())
        .then(function (response) {
            let previuosId = materiaSelected ? materiaSelected.id : null;
            if(response.status == 200){
                materias = response.data.materias;
                let selectMateriaHTML = document.getElementById('selectMateria');
                selectMateriaHTML.innerHTML = "";
                materias.forEach( u =>{
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["id"]);
                    let text = document.createTextNode(u["nombre"]);
                    option.appendChild(text);
                    selectMateriaHTML.appendChild(option);
                });
                materiaSelected = previuosId ? materias.filter(m => m.id == previuosId)[0] : materias[0];
                selectMateria.value = materiaSelected.id;
                onChangeMateria(materiaSelected.id);
            }
        });
    }
    loadMaterias();

    selectMateria.addEventListener('change', (e) =>{
        onChangeMateria(selectMateria.value)
    })

    function onChangeMateria(id){
        materiaSelected = materias.filter(m => m.id == id)[0];
        let profesor_name = materiaSelected.profesor ? materiaSelected.profesor.nombre_apellido: "Ninguno";
        document.getElementById('profesor').value = profesor_name;
        let asistente_name = materiaSelected.asistente ? materiaSelected.asistente.nombre_apellido: "Ninguno";
        document.getElementById('asistente').value = asistente_name;
    }



    let buttonEdit = document.getElementById('btn-edit');
    buttonEdit.addEventListener('click', (e) =>{
        openModalEdit(materiaSelected)
    });
    function openModalEdit(materia){
        let modal = $('#editModal')
        modal.find('#modal-materia').val(materia.nombre);
        modal.find('#modal-profesor').val(materia.profesor_id ? materia.profesor_id : -1);
        modal.find('#modal-asistente').val(materia.asistente_id ? materia.asistente_id : -1);
        modal.modal('show');
        modal.find('#btn-modal-success').click( function (event){
            modal.find('#btn-modal-success').off('click');
            let asistente_id = modal.find('#modal-asistente').children("option:selected").val();
            let profesor_id = modal.find('#modal-profesor').children("option:selected").val();
            axios.post(api.materia.asociar,{
                materia_id: materiaSelected.id,
                asistente_id: asistente_id == -1? null : asistente_id,
                profesor_id: profesor_id == -1? null : profesor_id,
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

    axios.get(api.user.docentes, getHeader())
    .then(function (response) {
        if(response.status == 200){
            let docentes = [{id: -1 , nombre_apellido:"Ninguno"}].concat(response.data.docentes);
            docentes.forEach( u => {
                let option = document.createElement("OPTION");
                option.setAttribute("id", "option-"+u["id"]);
                option.setAttribute("value", u["id"]);
                let text = document.createTextNode(u["nombre_apellido"]);
                option.appendChild(text);
                document.getElementById('modal-profesor').appendChild(option);
                document.getElementById('modal-asistente').appendChild(option.cloneNode(true));
            });
        }
    });
}

window.onload = function(){
    checkToken(['admin'], start);
}
