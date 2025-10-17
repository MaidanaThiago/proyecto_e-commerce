// Guardar usuario en sessionStorage al hacer login y redirigir a la página original si existe
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            if (username && password) {
                sessionStorage.setItem('usuario', username);
                // Redirige a la página original si existe, si no a products.html
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

    // MODO OSCURO 
    const darkModeToggle = document.getElementById('darkModeSwitch');
    const body = document.body;
    const logoBox = document.querySelector('.logo-box');
    const registroBox = document.querySelector('.registro');
    const footer = document.querySelector('footer');

    // Función para aplicar o quitar el modo oscuro
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        logoBox.classList.toggle('dark-logo-box');
        registroBox.classList.toggle('dark-registro');
        footer.classList.toggle('dark-footer');

        // Guarda la preferencia del usuario en localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // Evento al hacer clic en el switch
    darkModeToggle.addEventListener('change', toggleDarkMode);

    // Comprobar si el modo oscuro estaba activo en la visita anterior
    if (localStorage.getItem('darkMode') === 'enabled') {
        darkModeToggle.checked = true; 
        toggleDarkMode(); // Aplica las clases de modo oscuro
    }
});


