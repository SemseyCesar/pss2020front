function start(auth) {
    let n = new NavBar(
        'navId',
        ['Home', 'Cargar nota', 'Buscar notas'],
        ['', './notas/notas.html', './notas/index.html'],
        'Docente',
        'Username'
    );
}

window.onload = function() {
    checkToken(['docente'], start);
}
