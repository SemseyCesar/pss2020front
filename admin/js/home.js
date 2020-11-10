function start() {
    new NavBar(
        'navId',
        ['Home', 'Usuarios', 'Carreras', 'Materias', 'Exámenes', 'Notas', 'Asociar Doc-Mat'],
        ['', '../users/index.html', '../careers/index.html', '../signatures/index.html', '../exams/index.html', '../docente/notas/notas.html', '../signatures/asociar.html'],
        'Admin',
        'Username'
    )
}

window.onload = function() {
    checkToken(['admin'], start);
}
