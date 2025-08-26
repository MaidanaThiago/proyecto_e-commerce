// Redirección a login.html si no hay sesión iniciada
document.addEventListener('DOMContentLoaded', function() {
	// Verifica si hay un usuario guardado en sessionStorage
	const usuario = sessionStorage.getItem('usuario');
	if (!usuario) {
		window.location.href = 'login.html';
	}
});
