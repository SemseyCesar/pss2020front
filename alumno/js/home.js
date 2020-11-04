function start() {
    new NavBar(
        'navId',
        ['Home', 'Inscripcion carrera', 'Inscripcion materia'],
        ['', './inscripcion/career.html', './inscripcion/signature.html'],
        'Alumno',
        'Username'
    )
}

window.onload = function() {
    checkToken(['alumno'], start);
}
