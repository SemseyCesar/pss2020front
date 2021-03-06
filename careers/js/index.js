function start(auth) {
    if (auth=='admin') {
        new NavBar(
            'navId',
            ['Home', 'Usuarios', 'Carreras', 'Materias', 'Exámenes', 'Notas', 'Asociar Doc-Mat'],
            ['../admin/home.html', '../users/index.html', '', '../signatures/index.html', '', '../docente/notas/notas.html', '../signatures/asociar.html'],
            "Admin",
            localStorage.getItem('user_name'),
            '../auth/login.html'
        );
	}

	var careersRows = [];

	let table = new Table('carrerList',['Codigo','Nombre','Departamento','Docente','Duración',''],
        ['identificador','nombre','dpto','docente','duracion'], null);
    table.setWidths(['18%','20%','20%','20%','10%']);

    table.setOnDeleteEvent((id)=> {
        var opcion = confirm("¿Seguro/a que quiere borrar la carrera?");
        if (opcion == true) {
    		axios.delete(api.carrera.carrera+"/"+id, getHeader())
    			.then(function (response) {
    				if(response.status == 200){
    					searchApi();
    				}
    			});
        }
    })

    table.setOnEditEvent((id) =>{
        window.location.href = './create.html?id=' + id;
    })

    let searchValue = new SearchBar(
        'searchValueSection',
        ['text','text','text'],
        ['Seleccione una opción','Ingrese el Nombre','Ingrese el Código'],
        ['','','',''],
        null
    );

    let select = new Select(
        'selectSection',
        ['', 'nombre', 'identificador'],
        ['Buscar por...', 'Nombre', 'Código'],
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
	btnBuscar.addEventListener('click', searchApi)

	function filterBy(data, type, filterInput) {
		careersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(careersRows);
	}

	function searchApi(){
		if (select.validity() && searchValue.validity()){
			let urlSearch = api.carrera.carrera;
			let field = select.select.value;
			let value = searchValue.getInput();
			if(field && value){
				urlSearch += "?" + field +"="+value;
			}

			axios.get(urlSearch, getHeader()
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.carreras;
					filterBy(data, select.getValue(), searchValue.getInput());
					document.getElementById("footer").innerHTML = cardFooter(careersRows.length);
				}
			});
		}
	}
}





window.onload = function(){
    checkToken(['admin'], start);
}
