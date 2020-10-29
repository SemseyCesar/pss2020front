window.onload = function() {
	let table = new Table('usersList',['LU','DNI','Nombre y Apellido','Rol',''],
		['legajo','DNI','nombre_apellido','type'], null);
	table.setWidths(['20%','20%','20%','20%']);

	table.setOnDeleteEvent((id)=>{
		console.log("Borrando " + id);
	})

	table.setOnEditEvent((id) =>{
		console.log("Modificando " + id);
	})

	const selectElement = document.getElementById('selecTypeSearch');
	selectElement.addEventListener('change', (event) => {
		const searchText = document.getElementById('searchValue');
		document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");
        // Reseteo el valor de validez en caso de que el text field estuviera en estado inválido
        searchText.setAttribute("class", "form-control");
        if (event.target.value == "name") {
        	searchText.placeholder = `Ingrese el nombre y apellido`;
        	searchText.type = "text";
        }
        else {
        	searchText.type = "number";
        	if (event.target.value == "lu") {
        		searchText.placeholder = `Ingrese el L.U.`;
        	} else {
        		if (event.target.value == "dni") {
        			searchText.placeholder = `Ingrese el DNI`;
        		} else {
        			searchText.placeholder = "Seleccione una opción";
        			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
        		}
        	}
        }
    });

	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) => {
        // Si se seleccionó una de las opciones de búsqueda, procedo
        if (document.getElementById("selecTypeSearch").checkValidity()){
          // Reseteo el campo de opciones a válido
          document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");

          let searchValue = document.getElementById('searchValue');
          // Como hay dos tipos posibles de ingreso, texto para el nombre o número para dni/lu, controlo el tipo
          if (searchValue.checkValidity()) {
            // Si valida, se resetea sacando el valor de is-invalid
            searchValue.setAttribute("class", "form-control");
            axios.post('https://pss2020api.herokuapp.com/api/user/search',
            {
            	"search": searchValue.value,
            }
            ).then(function (response) {
            	console.log(response);
            	if(response.status == 200){
            		let data = response.data.users;
            		var filter;
            		if (selecTypeSearch.value == "name")
            			filter = 'nombre_apellido';
            		else
            			if (selecTypeSearch.value == "lu")
            				filter = 'legajo';
            			else
            				filter = 'DNI';
            			let counter = filterBy(data, filter);
            			updateCardFooter(counter);
            		}
            	})
        }
            // Si no valida el tipo de dato, se marca el error
            else {
            	searchValue.setAttribute("class", "form-control is-invalid");
            }
        }
        // Si no se seleccionó ninguna opción de búsqueda, se marca el error 
        else {
        	document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
        }
    });

	function filterBy(data, type) {
		let searchValue = document.getElementById('searchValue').value;
		var counter = 0;
		var filteredUsers = [];
		data.forEach( item => {
			if (item[type].includes(searchValue)) {
				filteredUsers.push(item);
				counter++;
			}
		})
		table.refreshSelected(filteredUsers);
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