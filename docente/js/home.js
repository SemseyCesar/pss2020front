function start(auth) {
    let n = new NavBar(
        'navId',
        ['Home', 'Cargar nota', 'Exámenes'],
        ['', './notas/notas.html', '../exams/index.html'],
        'Docente',
        'Username'
    );
}

window.onload = function() {
    checkToken(['docente'], start);
}
