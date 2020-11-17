function start(auth){
	if (auth=='admin')
        new NavBar(
            'navId',
            ['Home', 'Usuarios', 'Carreras', 'Materias', 'Exámenes', 'Notas', 'Asociar Doc-Mat'],
            ['../admin/home.html', '../users/index.html', '../careers/index.html', '', '../exams/index.html', '../docente/notas/notas.html', './asociar.html'],
            "Admin",
            localStorage.getItem('user_name'),
            '../auth/login.html'
        );
	else if (auth=='docente') {
		new NavBar(
	        'navId',
	        ['Home', 'Notas', 'Exámenes'],
	        ['', '../notas/notas.html', '../exams/index.html'],
	        'Docente',
	        localStorage.getItem('user_name'),
	        '../auth/login.html'
	    );
	}

	var signaturesRows = [];

	let table = new Table('signatureList',['Codigo','Nombre','Departamento',''],
		['identificador','nombre','dpto'], null);
	table.setWidths(['25%','25%','25%']);

	table.setOnDeleteEvent((id)=>{
		var confirmacion = confirm("Esta seguro que desea eliminar la materia?");
        if(confirmacion)
			axios.delete(api.materia.materia+"/"+id, getHeader())
				.then(function (response) {
					if(response.status == 200){
						searchApi();
					}
				});
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
	btnBuscar.addEventListener('click', searchApi);

	function filterBy(data, type, filterInput) {
		signaturesRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(signaturesRows);
	}

	function searchApi(){
		if (select.validity() && searchValue.validity()){

			let urlSearch = api.materia.materia;
			let field = select.select.value;
			let value = searchValue.getInput();
			if(field && value){
				urlSearch += "?" + field +"="+value;
			}
			axios.get(urlSearch, getHeader()
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.materias;
					filterBy(data, select.getValue(), searchValue.getInput());
                    document.getElementById("footer").innerHTML = cardFooter(signaturesRows.length);
				}
			})
		}
	}
}

window.onload = function(){
    checkToken(['admin', 'docente'], start);
}
