var materias = [];
var selectMateria = document.getElementById("selectSignature");

function loadSignatures() {
	axios.get(
		api.materia.materia,
		getHeader()
	).then(function (response) {
		if (response.status == 200 || response.status == 204) {
            materias = response.data.materias;
			loadSelect(
				selectMateria,
				response.data.materias,
				"Seleccione una materia"
			);
		}
	});
}

function loadSelect(select, data, defaultText) {
	select.innerHTML = "";
	let op = document.createElement('option');
	op.setAttribute("value", "");
	op.appendChild(document.createTextNode(defaultText));
	select.appendChild(op);
	data.forEach((d) => {
		let option = document.createElement("option");
		option.setAttribute("id", select.getAttribute("id")+"-"+d['id']);
		option.setAttribute("value", d['id']);
		option.appendChild(document.createTextNode(d['nombre']));
		select.appendChild(option);
	});
}

function selectOnChange(materiaId){
    let materia = materias.filter(m => m.id == materiaId)[0];
    let notaFinalInput = document.getElementById('notaFinal');
    let notaCursadoInput = document.getElementById('notaCursado');
    if(materia){
        let notaCursado = materia.pivot.nota_cursado;
        notaCursadoInput.value = notaCursado ? notaCursado : "Sin Calificar";
        let notaFinal = materia.pivot.nota_final;
        notaFinalInput.value = notaFinal ? notaFinal : "Sin Calificar";
    }else{
        notaFinalInput.value = "";
        notaCursadoInput.value = "";
    }
}

function start() {
    loadSignatures();
	selectMateria.addEventListener('change', (event) => selectOnChange(selectMateria.value));
}

window.onload = function() {
    checkToken(['alumno'], start);
}
