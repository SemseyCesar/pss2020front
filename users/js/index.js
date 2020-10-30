window.onload = function() {
    var usersRows = [];

	let table = new Table('usersList',['LU','DNI','Nombre y Apellido','Rol',''],
		['legajo','DNI','nombre_apellido','type'], null);
	table.setWidths(['20%','20%','20%','20%']);

	table.setOnDeleteEvent((id)=>{
		console.log("Borrando " + id);
	})

	table.setOnEditEvent((id) =>{
		console.log("Modificando " + id);
	})

    let searchValue = new SearchBar(
        'searchValueSection',
        ['text','number','number','text'], 
        ['Seleccione una opción','Ingrese el LU','Ingrese el DNI','Ingrese el nombre y apellido'],
        ['','El LU debe ser un numero','El DNI debe ser un número',''],
        null
    );

    let select = new Select(
        'selectSection',
        ['', 'legajo', 'DNI', 'nombre_apellido'],
        ['Buscar por...', 'LU', 'DNI', 'Nombre y apellido'],
        'Seleccione una opción.',
        searchValue,
        null
    );

    select.setOnChange(() => {
        select.validity();
        searchValue.setAttributes(select.getSelectedIndex());
        searchValue.validity();
    })

	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) => {
        if (select.validity() && searchValue.validity()) {
            axios.post('https://pss2020api.herokuapp.com/api/user/search',
            {
                "search": searchValue.getInput(),
            }).then(function (response) {
                console.log(response);
                if(response.status == 200){
                    let data = response.data.users;
                    filterBy(data, select.getValue(), searchValue.getInput());
                    updateCardFooter(usersRows.length);
                }
            })
        }
    });

	function filterBy(data, type, filterInput) {
		usersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(usersRows);
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