function start() {
    new NavBar(
        'navId',
        ['Home', 'Inscripcion carrera', 'Inscripcion materia', 'Exámenes','Editar Datos'],
        ['', './inscripcion/career.html', './inscripcion/signature.html', './inscripcion/exam.html'
        , './inscripcion/perfil.html'],
        'Alumno',
        'Username'
    )
}

window.onload = function() {
    checkToken(['alumno'], start);
}
