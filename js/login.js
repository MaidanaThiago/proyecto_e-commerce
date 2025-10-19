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

    // --- MODO OSCURO ---
    const darkModeToggle = document.getElementById('darkModeSwitch');
    const body = document.body;
    const logoBox = document.querySelector('.logo-box');
    const registroBox = document.querySelector('.registro');
    const footer = document.querySelector('footer');

    // Función para aplicar o quitar el modo oscuro
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        // Asegúrate de que los selectores .logo-box, .registro y footer existen en el HTML
        if (logoBox) logoBox.classList.toggle('dark-logo-box');
        if (registroBox) registroBox.classList.toggle('dark-registro');
        if (footer) footer.classList.toggle('dark-footer');

        // Guarda la preferencia del usuario en localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // Evento al hacer clic en el switch
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    // Comprobar si el modo oscuro estaba activo en la visita anterior
    if (localStorage.getItem('darkMode') === 'enabled') {
        if (darkModeToggle) darkModeToggle.checked = true;
        // Se llama a toggleDarkMode para aplicar las clases de inmediato
        // NOTA: Si se ejecuta aquí, es mejor asegurarse de que solo se apliquen las clases si no están ya puestas
        body.classList.add('dark-mode');
        if (logoBox) logoBox.classList.add('dark-logo-box');
        if (registroBox) registroBox.classList.add('dark-registro');
        if (footer) footer.classList.add('dark-footer');
    }
});