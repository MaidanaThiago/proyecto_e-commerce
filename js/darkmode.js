// --- MODO OSCURO GLOBAL + LOGIN --- //
document.addEventListener('DOMContentLoaded', () => {
  const darkModeSwitch = document.getElementById('darkModeSwitch');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Reflejar el estado en el switch
  if (darkModeSwitch) {
    darkModeSwitch.checked = currentTheme === 'dark';
  }

  // Aplicar modo oscuro en login si existe estructura del login
  aplicarModoOscuroLogin(currentTheme === 'dark');

  // Escuchar cambios
  if (darkModeSwitch) {
    darkModeSwitch.addEventListener('change', () => {
      const newTheme = darkModeSwitch.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      aplicarModoOscuroLogin(newTheme === 'dark');
    });
  }

  // Detectar preferencia del sistema en la primera visita
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', systemTheme);
    localStorage.setItem('theme', systemTheme);
    if (darkModeSwitch) darkModeSwitch.checked = prefersDark;
    aplicarModoOscuroLogin(prefersDark);
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
