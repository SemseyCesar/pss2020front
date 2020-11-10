function start() {

    var materias = [];
    var correlativas = [];
    let table = new Table('correlativas',['','Materia','Correlativa','Tipo',''],
        ['','nombre_1','nombre_2','tipo',''], null, true);
    table.setWidths(['10%','20%','20%','15%', '10%']);

    let fields = {
        materiaValidator: new InputValidator("selectMateria", "selectMateriaFeedback",
            {valueMissing: "Seleccione una materia"}),
        correlativaValidator: new InputValidator("selectCorrelativa", "selectCorrelativaFeedback",
            {valueMissing: "Seleccione una correlativa"}),
        tipoValidator: new InputValidator("selectTipoCorrelativa", "selectTipoCorrelativaFeedback",
            {valueMissing: "Seleccione un tipo"}),
    }

    let selectMateria = document.getElementById("selectMateria");
    let selectCorrelativa = document.getElementById("selectCorrelativa");
    let selectTipoCorrelativa = document.getElementById("selectTipoCorrelativa");

    selectMateria.addEventListener("change", (event) => onSelectMateriaChange(event));
    selectCorrelativa.addEventListener("change", (event) => {
        fields.correlativaValidator.validate()});
    selectTipoCorrelativa.addEventListener("change", (event) => {
        fields.tipoValidator.validate()});

    document.getElementById("addCorrelativa").addEventListener("click", (event) => addCorrelativa());

    table.setOnDeleteEvent((id)=> {
        var opcion = confirm("¿Seguro/a que quiere borrar la correlativa?");
        if (opcion == true) {
            correlativas = correlativas.filter(c => ((c.materia_id+"-"+c.correlativa_id) != id));
            table.refreshSelected(correlativas);
            // TODO -> ENVIAR MENSAJE A API PARA BORRAR LA CORRELATIVA
        }

    })

    loadSignatures();




    function loadSignatures() {
        axios.post(api.materia.search,
            {
                "search": "",
            },
            getHeader()
        ).then(function (response) {
            if(response.status == 200){
                materias = response.data.materias;
                loadSelect(
                    selectMateria,
                    materias
                );
            }
        });
    }

    function onSelectMateriaChange(event) {
        fields.materiaValidator.validate();
        var materiasValidas = materias.filter((materia) => materia.id != event.target.value);
        if (event.target.value == "")
            materiasValidas = [];
        loadSelect(
            selectCorrelativa,
            materiasValidas
        );
    }

    function loadSelect(select, materias) {
        var oldOption
        while (oldOption = document.getElementById(select.getAttribute("id")+"-option"))
            select.removeChild(oldOption);
        materias.forEach((materia) => {
            let option = document.createElement("option");
            option.setAttribute("id", select.getAttribute("id")+"-option");
            option.setAttribute("value", materia['id']);
            let text = document.createTextNode(materia['nombre']);
            option.appendChild(text);
            select.appendChild(option);
        })
    }

    function addCorrelativa() {
        if (validate()) {/*
            TODO -> AGREGAR LA LLAMADA A LA API CUANDO ESTE LA RUTA

            axios.post(
                getDataToSend(),
                getHeader()
            ).then(function(response) {
                if(response.status == 200){*/
                    let materiaId = selectMateria.value;
                    let correlativaId = selectCorrelativa.value;
                    correlativas.push(
                        {
                            "id": materiaId+"-"+correlativaId,
                            "materia_id": materiaId,
                            "nombre_1": selectMateria.options[selectMateria.selectedIndex].innerText,
                            "correlativa_id": correlativaId,
                            "nombre_2": selectCorrelativa.options[selectCorrelativa.selectedIndex].innerText,
                            "tipo": selectTipoCorrelativa.options[selectTipoCorrelativa.selectedIndex].innerText
                        }
                    );
                    let alert = document.getElementById("alertCorrect");
                    alert.style.display = "block";
                    window.setTimeout(function() {
                        alert.style.display = "none";
                    }, 4000);
                    table.refreshSelected(correlativas);
/*                }
            }).catch(function (error) {
                let alert = document.getElementById("alertIncorrect");
                var text;
                if(error.response)
                    text = "<strong>Error:</strong>" + error.response.data.message;
                else
                    text = "<strong>Error: </strong> No se pudo comunicar con el sistema";
                alert.innerHTML = text;
                alert.style.display = "block";
                window.setTimeout(function() {
                    alert.style.display = "none";
                }, 4000);
            });*/
        }
        console.log(correlativas);
    }

// TODO -> AGREGAR EL FORMATO QUE VAYA EN LA BD

    function getDataToSend() {
        return {

        }
    }

    function validate() {
        let materiaId = selectMateria.value;
        let correlativaId = selectCorrelativa.value;
        let valid = validateInputs() && notExists(materiaId, correlativaId);
        return valid;

/*
        TRATANDO DE CONTROLAR LAS CORRELATIVAS CRUZADASSSSSSS


        let validData = validateData(materiaId, correlativaId);
        if (!validData) {
            let alert = document.getElementById("alertIncorrect");
            alert.innerHTML = "<strong>Error al guardar.</strong> Correlativa cruzada.";
            alert.style.display = "block";
            window.setTimeout(function() {
                alert.style.display = "none";
            }, 4000);
        }*/

//        return valid && validData;

/*        var valid = false;
        if (validateSelects) {

        }*/
    }

    function validateInputs() {
        let validValues = Object.values(fields).map(field => field.validate());
        let firstNoValid = validValues.findIndex(value => !value);
        if (firstNoValid != -1)
            Object.values(fields)[firstNoValid].getField().focus();
        return firstNoValid==-1;
    }

    function notExists(materiaId, correlativaId) {
        let valid = correlativas.filter((c) =>
            (c.materia_id == materiaId && c.correlativa_id == correlativaId)
        ).length == 0;
        if (!valid) {
            let alert = document.getElementById("alertIncorrect");
            alert.innerHTML = "<strong>Error al guardar.</strong> La correlativa ya existe.";
            alert.style.display = "block";
            window.setTimeout(function() {
                alert.style.display = "none";
            }, 4000);
        }
        return valid;
    }
/*

    TRATANDO DE CONTROLAR LAS CORRELATIVAS CRUZADASSSSSSS

    function validateData(materiaId, correlativaId) {
        let correlativasActuales = correlativas.filter((c) => c.materia_id == correlativaId);
        var i = 0;
        var found = false;
        while ((i<correlativasActuales.length) && (!found)) {
            found = correlativasActuales.correlativa_id == materiaId;
            i++;
        }
        i = 0;
        while ((i<correlativasActuales.length) && (!found)) {
            found = validateData(materiaId, correlativasActuales[i].correlativa_id);
            i++;
        }
        return !found;
    }*/
}









window.onload = start(); /*function(){
    checkToken(['admin'], start);
}
}*/
