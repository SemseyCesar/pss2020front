function start(auth){
    if (auth=='admin')
        new NavBar(
            'navId',
            ['Home', 'Usuarios', 'Carreras', 'Materias', 'Exámenes', 'Notas', 'Asociar Doc-Mat'],
            ['../admin/home.html', '', '../careers/index.html', '../signatures/index.html', '../exams/index.html', '../docente/notas/notas.html', '../signatures/asociar.html'],
            "Admin",
            localStorage.getItem('user_name'),
            '../auth/login.html'
        )

    var usersRows = [];

	let table = new Table('usersList',['LU','DNI','Nombre y Apellido','Rol',''],
		['legajo','DNI','nombre_apellido','type'], null);
	table.setWidths(['20%','20%','20%','20%']);

	table.setOnDeleteEvent((id) => {
        var opcion = confirm("¿Seguro/a que quiere borrar el usuario?");
        if (opcion == true) {
            axios.delete(api.user.user+"/"+id, getHeader())
                .then((response)=>{
                    console.log(response);
                })
        }
	})

	table.setOnEditEvent((id) =>{
        window.location.href = './create.html?id=' + id;
	})

    let searchValue = new SearchBar(
        'searchValueSection',
        ['text','number','number','text'],
        ['Seleccione una opción','Ingrese el LU','Ingrese el Documento','Ingrese el nombre y apellido'],
        ['','El LU debe ser un numero','El DNI debe ser un número',''],
        null
    );

    let select = new Select(
        'selectSection',
        ['', 'legajo', 'DNI', 'nombre_apellido'],
        ['Buscar por...', 'LU', 'Documento', 'Nombre y apellido'],
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
            axios.post(api.user.search,
            {
                "search": searchValue.getInput(),
            }, getHeader()).then(function (response) {
                console.log(response);
                if(response.status == 200){
                    let data = response.data.users;
                    filterBy(data, select.getValue(), searchValue.getInput());
                    document.getElementById("footer").innerHTML = cardFooter(usersRows.length);
                }
            })
        }
    });

	function filterBy(data, type, filterInput) {
		usersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(usersRows);
	}
}

window.onload = function(){
    checkToken(['admin'], start);
}
