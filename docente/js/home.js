function start(auth) {
    let n = new NavBar(
        'navId',
        ['Home', 'Notas', 'Exámenes'],
        ['', './notas/notas.html', '../exams/index.html'],
        'Docente',
        'Username'
    );
}

window.onload = function() {
    checkToken(['docente'], start);
}
