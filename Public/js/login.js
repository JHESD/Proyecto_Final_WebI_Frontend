document.getElementById("registerUsrButton").addEventListener("click", function () {
    window.location.href = "../html/user_register.html";
});
document.getElementById("registerAdmButton").addEventListener("click", function () {
    window.location.href = "../Html/admin_register.html";
});

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/usuario/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_correo: email, contrasena: password })
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('isAdmin', data.usuario.esAdmin);
            localStorage.setItem('usuarioId', data.usuario.id);
        
            if (data.usuario.esAdmin) {
                if (!data.usuario.negocioId) {
                    alert('El administrador no tiene asignado un negocio. Contacte al soporte.');
                    return;
                }
                localStorage.setItem('negocioId', data.usuario.negocioId);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('isAdmin', data.usuario.esAdmin);
                localStorage.setItem('usuarioId', data.usuario.id);
            }
        
            if (data.usuario.esAdmin) {
                window.location.href = '../Html/admin/admin_home.html';
            } else {
                window.location.href = '../Html/user/user_home.html';
            }
        } else {
            alert(data.message);
        }        
    } catch (error) {
        console.error('Error:', error);
    }
});