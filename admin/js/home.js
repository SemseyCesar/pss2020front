function start() {
    new NavBar(
        'navId',
        ['Home', 'Usuarios', 'Carreras', 'Materias', 'Notas'],
        ['', '../users/index.html', '../careers/index.html', '../signatures/index.html', '../docente/notas/notas.html'],
        'Admin',
        'Username'
    )
}

window.onload = function() {
    checkToken(['admin'], start);
}
