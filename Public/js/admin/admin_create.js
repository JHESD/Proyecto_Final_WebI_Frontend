const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('product-category');
    obtenerCategorias();

    async function obtenerCategorias() {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!response.ok) throw new Error('Error al obtener las categorías');
            const categorias = await response.json();
            renderizarCategorias(categorias);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            categorySelect.innerHTML = `<option value="">Error al cargar categorías</option>`;
        }
    }

    function renderizarCategorias(categorias) {
        categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
        categorias.forEach((categoria) => {
            const option = document.createElement('option');
            option.value = categoria.id; // El valor será el ID de la categoría
            option.textContent = categoria.nombre; // El texto visible será el nombre de la categoría
            categorySelect.appendChild(option);
        });
    }
});

document.getElementById('btn-save').addEventListener('click', async () => {
    const negocioId = localStorage.getItem('negocioId');
    if (!negocioId) {
        alert('No se encontró el ID del negocio. Por favor, inicie sesión nuevamente.');
        window.location.href = "../Html/login.html";
        return;
    }

    const formData = new FormData();
    formData.append('nombre', document.getElementById('product-name').value.trim());
    formData.append('descripcion', document.getElementById('product-description').value.trim());
    formData.append('precio', parseFloat(document.getElementById('product-price').value));
    formData.append('categoria_id', document.getElementById('product-category').value); // Valor seleccionado del select
    formData.append('negocio_id', negocioId);

    if (!formData.get('nombre') || !formData.get('descripcion') || isNaN(formData.get('precio')) || !formData.get('categoria_id')) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    const imageInput = document.getElementById('product-images');
    if (imageInput && imageInput.files.length > 0) {
        for (const file of imageInput.files) {
            formData.append('imagenes', file);
        }
    }

    try {
        const response = await fetch('http://localhost:3000/product/prd', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });

        if (response.ok) {
            window.location.href = '../admin/business_product_list.html';
        } else {
            const error = await response.json();
            alert(`Error al crear el producto: ${error.message || 'Error desconocido.'}`);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('Hubo un error al intentar crear el producto.');
    }
});

document.getElementById('btn-cancel').addEventListener('click', () => {
    const confirmCancel = confirm('¿Estás seguro de que deseas cancelar la creación del producto?');
    if (confirmCancel) {
        window.location.href = '../admin/business_product_list.html';
    }
});