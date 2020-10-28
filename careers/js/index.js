window.onload = function() {
	const selectElement = document.getElementById('selecTypeSearch');
	selectElement.addEventListener('change', (event) => {
		const searchText = document.getElementById('searchValue');
		document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");
		if (event.target.value == "name") {
			searchText.placeholder = "Ingrese el Nombre";
		}
		else {
			if (event.target.value == "code") {
				searchText.placeholder = "Ingrese el Codigo";
			} else {
				searchText.placeholder = "Seleccione una opción";
				document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
			}
		}
	});

	function createItem(data){
		let fila = document.createElement("tr");
		let celda_identificador = document.createElement("td");
		let celda_nombre = document.createElement("td");
		let celda_departamento = document.createElement("td");
		let celda_docente = document.createElement("td");
		let celda_duracion = document.createElement("td");
		let celda_boton_modificar = document.createElement("td");
		let celda_boton_borrar = document.createElement("td");

		let boton_modificar = document.createElement("button");
		let boton_borrar = document.createElement("button");
		let icon_modificar = document.createElement("i");
		let icon_borrar = document.createElement("i");
		icon_modificar.setAttribute("class", "fa fa-edit");
		icon_borrar.setAttribute("class", "fa fa-trash");
		boton_modificar.setAttribute("class", "btn btn-outline-warning");
		boton_modificar.setAttribute("id", ""+data['identificador']);
		boton_modificar.addEventListener('click', (event) => {
			document.getElementById('footer').innerHTML = event.target.id;
		})
		boton_borrar.setAttribute("class", "btn btn-outline-danger");
		boton_modificar.appendChild(icon_modificar);
		boton_borrar.appendChild(icon_borrar);

		celda_identificador.appendChild(document.createTextNode(""+data['identificador']));
		celda_nombre.appendChild(document.createTextNode(""+data['nombre']));
		celda_departamento.appendChild(document.createTextNode(""+data['dpto']));
		celda_docente.appendChild(document.createTextNode(""+data['docente']));
		celda_duracion.appendChild(document.createTextNode(""+data['duracion']));
		celda_boton_modificar.appendChild(boton_modificar);
		celda_boton_borrar.appendChild(boton_borrar);

		fila.appendChild(celda_identificador);
		fila.appendChild(celda_nombre);
		fila.appendChild(celda_departamento);
		fila.appendChild(celda_docente);
		fila.appendChild(celda_duracion);
		fila.appendChild(celda_boton_modificar);
		fila.appendChild(celda_boton_borrar);

		return fila;
	}


	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) => {
		if (document.getElementById("selecTypeSearch").checkValidity()){
			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");
			let list = document.getElementById('careerList');
			list.innerHTML="";
			axios.post('https://pss2020api.herokuapp.com/api/carrera/search',
			{
				"search": document.getElementById('searchValue').value,
			}
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.carreras;
					var filter;
					if (selecTypeSearch.value == "name")
						filter = 'nombre';
					else
						filter = 'identificador';
					let counter = filterBy(data, filter);
					updateCardFooter(counter);
				}
			});
		} else {
			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
		}
	})

	function filterBy(data, type) {
		let searchValue = document.getElementById('searchValue').value;
		var counter = 0;
		data.forEach( item => {
			if (item[type].includes(searchValue)) {
				document.getElementById('careerList').appendChild(createItem(item));
				counter++;
			}
		})
		return counter;
	}

	function updateCardFooter(counter) {
		const footer = document.getElementById("footer");
		var footerText;
		if (counter==0)
			footerText = "No hay resultados";
		else
			if (counter==1)
				footerText = "Se encontró " + counter + " resultado";
			else
				footerText = "Se encontraron " + counter + " resultados";
			footer.innerHTML = footerText;
		}
}