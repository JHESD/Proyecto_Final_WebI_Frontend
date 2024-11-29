const api = 'http://localhost:3000';

document.getElementById('registerUsrButton').addEventListener('click', async (e) => {
    e.preventDefault();

    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    const usuario_correo = formData.get('usuario_correo');
    const nombre_completo = formData.get('nombre_completo');
    const nit = formData.get('nit');
    const direccion = formData.get('direccion');
    const contrasena = formData.get('contrasena');

    if (!usuario_correo || !nombre_completo || !nit || !direccion || !contrasena) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch(`${api}/usuario/usr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario_correo,
                nombre_completo,
                nit,
                direccion,
                contrasena,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            console.log('Respuesta del servidor:', result);

            window.location.href = '../html/login.html';
        } else {
            alert(`Error: ${result.message}`);
            console.error('Error del servidor:', result);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('Ocurrió un error al registrar el usuario.');
    }
});

