function start(auth) {
	if (auth=='docente') {
		new NavBar(
			'navId',
			['Home', 'Notas', 'Exámenes'],
			['../docente/home.html', '../docente/notas/notas.html', './index.html'],
			'Docente',
			localStorage.getItem('user_name'),
			'../auth/login.html'
		);
	}

	var signatures = [];
	let fields = {
		examSignatures: new InputValidator('examSignatures', 'examSignatureFeedback',
			{valueMissing: 'Seleccione una opción'}),
		examCode: new InputValidator('examCode', 'examCodeFeedback',
			{valueMissing: 'Ingrese un código'}),
		examDate: new InputValidator('examDate', 'examDateFeedback',
			{valueMissing: 'Ingrese una fecha', customError: ''}),
		examTime: new InputValidator('examTime', 'examTimeFeedback',
			{valueMissing: 'Ingrese un horario'}),
		examClassroom: new InputValidator('examClassroom', 'examClassroomFeedback',
			{valueMissing: 'Ingrese un aula'})
	};

	const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;

    if(edit){
		loadInput(_id)
	}else{
		loadSignatures()
	}

	function loadSignatures() {
		axios.get(api.materia.materia, getHeader()
		).then(function (response) {
			if(response.status == 200){
				signatures = response.data.materias;
				let select = document.getElementById("examSignatures");
				signatures.forEach(s => {
					let option = createSignatureOption(s);
					select.appendChild(option);
				});
			}
		})
	}

	function createSignatureOption(signature) {
		let option = document.createElement("option");
		option.value = signature['id'];
		option.textContent = signature['nombre'];
		return option
	}

	document.getElementById("btnGuardar").addEventListener("click", (event) => save());

	function save() {
		if (edit)
			apiEdit();
		else
			apiCreate();
	}

	function apiCreate() {
		if (localValidate()) {
			axios.post(api.examen.examen, getDataToSend(), getHeader()
			).then(function(response) {
				if (response.status == 200) {
					alert("Examen cargado exitosamente");
					window.history.back();
				}
			}).catch(function(error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
			});
		}
	}

    function apiEdit(){
        if (localValidate()){
            axios.put(api.examen.examen+"/"+_id,
                getDataToSend() , getHeader()
            ).then(function (response){
                if(response.status == 200){
					alert("Examen modificado exitosamente");
					window.history.back()
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            });
        }
    }

	function getTime(){
		var time = document.getElementById("examTime").value;
		const splittedString = time.split(":");
		return splittedString[0]+":"+splittedString[1];
	}

	function getDataToSend() {
		return {
			"identificador": document.getElementById("examCode").value,
			"materia_id": document.getElementById("examSignatures").value,
			"fecha": document.getElementById("examDate").value,
			"hora": getTime(),
			"aula": document.getElementById("examClassroom").value,
		}
	}

	function loadInput(id){
        axios.get(api.examen.examen+"/"+id, getHeader())
        .then(function (response){
            if(response.status == 200){
				let examen = response.data.examen;
				let option = createSignatureOption(examen.materia);
				console.log(option);
				document.getElementById("examSignatures").appendChild(option);
				if (examen) {
	                document.getElementById('examCode').value = examen.identificador;
	                document.getElementById('examSignatures').value = examen.materia_id;
					document.getElementById('examDate').value = examen.fecha,
	                document.getElementById('examTime').value = examen.hora;
	                document.getElementById('examClassroom').value = examen.aula;
					document.getElementById('examSignatures').setAttribute("disabled", "true");
				} else {
					alerte("Error, no existe el exámen buscado");
				}
            }
        })
        .catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        });
    }

	function localValidate() {
		checkDate();
	    let validValues = Object.values(fields).map(field => field.validate());
	    let firstNoValid = validValues.findIndex(value => !value);
	    if (firstNoValid != -1)
	        Object.values(fields)[firstNoValid].getField().focus();
	    return firstNoValid==-1;
	}

	function checkDate() {
		if (document.getElementById('examDate').value != "") {
			let examDateValue = document.getElementById('examDate').value.split("-");
			let examDate = new Date(parseInt(examDateValue[0]),parseInt(examDateValue[1])-1,parseInt(examDateValue[2]));
			let today = new Date();
			today.setHours(0,0,0,0);
			if (examDate <= today) {
				fields.examDate.setCustomValidity("La fecha debe ser mayor al dia actual");
			} else {
				fields.examDate.setCustomValidity();
			}
		} else {
			fields.examDate.setCustomValidity();
		}
	}
}

window.onload = function(){
    checkToken(['docente'], start);
}
