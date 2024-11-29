// Obtener el ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const originalFormData = {};

if (productId) {
    const form = document.getElementById('form-update-product');
    form.setAttribute('data-product-id', productId);

    fetch(`http://localhost:3000/product/prd/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener los datos del producto');
            }
            return response.json();
        })
        .then(producto => {
            document.getElementById('product-name').value = producto.nombre || '';
            document.getElementById('product-business').value = producto.Negocio?.id || '';
            document.getElementById('product-category').value = producto.Categorium?.id || '';
            document.getElementById('product-price').value = producto.precio?.toFixed(2) || '0.00';
            document.getElementById('product-description').value = producto.descripcion || '';

            // Guardar los valores originales para cancelar cambios
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                originalFormData[input.id] = input.value;
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            alert('No se pudieron cargar los datos del producto.');
        });
} else {
    alert('ID de producto no especificado en la URL.');
}

document.getElementById('btn-save').addEventListener('click', async () => {
    const form = document.getElementById('form-update-product');
    const productId = form.dataset.productId;

    if (!productId) {
        alert('No se encontró el ID del producto. No se puede actualizar.');
        return;
    }

    const productData = {
        nombre: document.getElementById('product-name').value.trim(),
        descripcion: document.getElementById('product-description').value.trim(),
        precio: parseFloat(document.getElementById('product-price').value),
        categoria_id: document.getElementById('product-category').value,
        negocio_id: document.getElementById('product-business').value
    };

    if (!productData.nombre || !productData.descripcion || isNaN(productData.precio) || !productData.categoria_id || !productData.negocio_id) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/product/prd/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Producto actualizado con éxito.');
            window.location.href = '../admin/business_product_list.html';
        } else {
            const error = await response.json();
            alert(`Error al actualizar el producto: ${error.message || 'Error desconocido.'}`);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('Hubo un error al intentar actualizar el producto.');
    }
});

// Evento para cancelar los cambios
document.getElementById('btn-cancel').addEventListener('click', () => {
    const form = document.getElementById('form-update-product');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.value = originalFormData[input.id];
    });

    alert('Los cambios realizados han sido descartados.');
    window.location.href = '../admin/business_product_list.html';
});