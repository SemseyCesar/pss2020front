function start(auth) {
    let n = new NavBar(
        'navId',
        ['Home', 'Cargar nota', 'Buscar notas', 'Cargar examen'],
        ['', './notas/notas.html', './notas/index.html', '../exams/create.html'],
        'Docente',
        'Username'
    );
}

window.onload = function() {
    checkToken(['docente'], start);
}
