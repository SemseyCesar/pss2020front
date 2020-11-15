function start(auth) {
    let n = new NavBar(
        'navId',
        ['Home', 'Notas', 'Exámenes'],
        ['', './notas/notas.html', '../exams/index.html'],
        'Docente',
        localStorage.getItem('user_name'),
        '../auth/login.html'
    );
}

window.onload = function() {
    checkToken(['docente'], start);
}
