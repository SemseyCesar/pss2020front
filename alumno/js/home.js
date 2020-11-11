function start() {
    new NavBar(
        'navId',
        ['Home', 'Inscripcion carrera', 'Inscripcion materia', 'Exámenes'],
        ['', './inscripcion/career.html', './inscripcion/signature.html', '../exams/index.html'],
        'Alumno',
        'Username'
    )
}

window.onload = function() {
    checkToken(['alumno'], start);
}
