function start() {
    new NavBar(
        'navId',
        ['Home', 'Inscripcion carrera', 'Inscripcion materia', 'Exámenes','Editar Datos','Mis Notas'],
        ['', './inscripcion/career.html', './inscripcion/signature.html', './inscripcion/exam.html'
        , './inscripcion/perfil.html', './notas.html'],
        'Alumno',
        localStorage.getItem('user_name'),
        '../auth/login.html'
    )
}

window.onload = function() {
    checkToken(['alumno'], start);
}
