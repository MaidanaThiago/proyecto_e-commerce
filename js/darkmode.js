// --- MODO OSCURO GLOBAL + LOGIN --- //
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('checkbox');
  const body = document.body;
  const root = document.documentElement;

  if (!themeToggle) return; // Si no existe el switch, salir

  // Aplicar tema guardado (o sistema)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    if (themeToggle) themeToggle.checked = savedTheme === 'dark';
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    root.setAttribute('data-theme', systemTheme);
    localStorage.setItem('theme', systemTheme);
    if (themeToggle) themeToggle.checked = prefersDark;
  }

  // Aplicar tema guardado o por defecto
  body.setAttribute('data-theme', savedTheme || 'light');
  themeToggle.checked = savedTheme === 'dark';

  // Escuchar cambios en el switch
  themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Disparar evento personalizado para que otros scripts sepan del cambio
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  });

  // Aplicar tema del sistema en primera visita
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    body.setAttribute('data-theme', systemTheme);
    localStorage.setItem('theme', systemTheme);
    themeToggle.checked = prefersDark;
  }
});

// --- FUNCIÓN PARA EL LOGIN --- //
function aplicarModoOscuroLogin(activar) {
  const body = document.body;
  const logoBox = document.querySelector('.logo-box');
  const registro = document.querySelector('.registro');
  const footer = document.querySelector('footer');

  if (!logoBox || !registro || !footer) return; // si no es el login, salir

  if (activar) {
    body.classList.add('dark-mode');
    logoBox.classList.add('dark-logo-box');
    registro.classList.add('dark-registro');
    footer.classList.add('dark-footer');
  } else {
    body.classList.remove('dark-mode');
    logoBox.classList.remove('dark-logo-box');
    registro.classList.remove('dark-registro');
    footer.classList.remove('dark-footer');
  }
}
