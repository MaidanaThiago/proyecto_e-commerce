// --- MODO OSCURO GLOBAL ---
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeSwitch');
    const body = document.body;

    // Elementos comunes (pueden o no existir en cada página)
    const logoBox = document.querySelector('.logo-box');
    const registroBox = document.querySelector('.registro');
    const footer = document.querySelector('footer');
    const navbar = document.querySelector('.navbar');


    // Función para aplicar o quitar modo oscuro
    function toggleDarkMode() {
        const isDark = darkModeToggle.checked;

        body.classList.toggle('dark-mode', isDark);
        if (logoBox) logoBox.classList.toggle('dark-logo-box', isDark);
        if (registroBox) registroBox.classList.toggle('dark-registro', isDark);
        if (footer) footer.classList.toggle('dark-footer', isDark);
        if (navbar) navbar.classList.toggle('dark-navbar', isDark);


        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    }

    // Cargar el estado guardado
    if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    if (logoBox) logoBox.classList.add('dark-logo-box');
    if (registroBox) registroBox.classList.add('dark-registro');
    if (footer) footer.classList.add('dark-footer');
    if (navbar) navbar.classList.add('dark-navbar');
    if (darkModeToggle) darkModeToggle.checked = true;
}

    // Evento de cambio
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
});
