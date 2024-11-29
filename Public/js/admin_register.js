document.getElementById('registerAdmButton').addEventListener('click', async () => {

    const inputs = document.querySelectorAll('.sing-in .container-input input');
    const data = {
        usuario_correo: inputs[0].value,
        nombre_completo: inputs[1].value,
        nombre_negocio: inputs[2].value,
        direccion_negocio: inputs[3].value,
        direccion: inputs[4].value,
        contrasena: inputs[5].value,
    };

    if (Object.values(data).some(value => value.trim() === '')) {
        alert('Por favor complete todos los campos.');
        return;
    }

    try {

        const response = await fetch('http://localhost:3000/usuario/adm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Redirigiendo...');
            window.location.href = '../html/login.html';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al registrar administrador:', error);
        alert('Ocurrió un error. Inténtelo más tarde.');
    }
});
