// Guardar usuario en sessionStorage al hacer login y redirigir a la página original si existe
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            if (username && password) {
                sessionStorage.setItem('usuario', username);
                // Redirige a la página original si existe, si no a index.html
                const redirect = sessionStorage.getItem('redirectAfterLogin');
                if (redirect) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirect;
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Por favor, complete usuario y contraseña.');
            }
        });
    }


});