const API_BASE_URL = 'http://localhost:3000';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const usuarioId = localStorage.getItem('usuarioId');

if (productId) {
    fetch(`${API_BASE_URL}/product/prd/${productId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del producto');
            }
            return response.json();
        })
        .then((producto) => {
            console.log("Datos del producto:", producto);

            document.querySelector('.product-info h1').textContent = producto.nombre || 'Sin nombre';
            document.querySelector('.product-info h3').textContent = producto.Negocio?.nombre || 'Sin empresa';
            document.querySelector('.product-info p:nth-child(3)').textContent = `Categoría: ${producto.Categorium?.nombre || 'Sin categoría'}`;
            document.querySelector('.product-info p:nth-child(4)').textContent = `Precio: ${producto.precio?.toFixed(2) || '0.00'} Bs.`;
            document.querySelector('.product-description').textContent = producto.descripcion || 'Sin descripción.';

            const mainImage = document.querySelector('.carousel-container img');
            mainImage.src = producto.Imagens?.[0]?.url_imagen 
                ? `${API_BASE_URL}${producto.Imagens[0].url_imagen}` 
                : '../../img/comida.jpg';

            const carouselImages = document.querySelector('.carousel-images');
            carouselImages.innerHTML = '';
            producto.Imagens?.forEach((img) => {
                const imgElement = document.createElement('img');
                imgElement.src = `${API_BASE_URL}${img.url_imagen}`;
                imgElement.alt = producto.nombre || 'Imagen adicional';
                carouselImages.appendChild(imgElement);
            });

            const addToCartButton = document.querySelector('.add-to-cart');
            if (addToCartButton) {
                addToCartButton.setAttribute('data-producto-id', producto.id);
            }
        })
        .catch((error) => {
            console.error("Error al cargar el producto:", error);
            alert('No se pudo cargar el detalle del producto.');
        });
} else {
    alert('ID de producto no especificado en la URL.');
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.querySelector('.add-to-cart');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', async () => {
            const productoId = addToCartButton.getAttribute('data-producto-id');

            if (!productoId) {
                alert('Error: No se pudo identificar el producto.');
                return;
            }

            if (!usuarioId) {
                alert('Por favor, inicia sesión para agregar productos al carrito.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/car/cart/${usuarioId}/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productoId,
                        cantidad: 1,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message || 'Producto añadido al carrito.');
                } else {
                    const error = await response.json();
                    alert(error.message || 'Error al agregar el producto al carrito.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor.');
            }
        });
    }
});

async function obtenerCantidadCarrito() {
    if (!usuarioId) return 0;

    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${usuarioId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) throw new Error('Error al obtener el carrito');
        const data = await response.json();
        return data.productos.reduce((acc, producto) => acc + producto.cantidad, 0);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return 0;
    }
}

async function actualizarNumeroCarrito() {
    const cantidad = await obtenerCantidadCarrito();
    const numeroCarrito = document.querySelector('.container-user .number');
    if (numeroCarrito) numeroCarrito.textContent = `(${cantidad})`;
}

document.addEventListener('DOMContentLoaded', actualizarNumeroCarrito);

document.getElementById("btn-salir").addEventListener("click", (event) => {
    event.preventDefault();

    const confirmLogout = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
        localStorage.clear();
        window.location.href = "../../Html/login.html";
    }
});