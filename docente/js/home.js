function start(auth) {
    let n = new NavBar(
        'navId',
        ['Home', 'Cargar nota', 'Cargar examen'],
        ['', './notas/notas.html', '../exams/create.html'],
        'Docente',
        'Username'
    );
}

window.onload = function() {
    checkToken(['docente'], start);
}
