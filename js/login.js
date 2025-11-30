// Login con autenticación JWT
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                alert('Por favor, complete usuario y contraseña.');
                return;
            }

            try {
                // Hacer petición al endpoint de login
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Guardar token y datos del usuario
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    sessionStorage.setItem('usuario', data.user.username);

                    // Redirigir
                    const redirect = sessionStorage.getItem('redirectAfterLogin');
                    if (redirect) {
                        sessionStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirect;
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.error || 'Error al iniciar sesión');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Verifique que el servidor esté corriendo.');
            }
        });
    }
});