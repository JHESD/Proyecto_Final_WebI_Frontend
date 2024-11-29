const usuarioId = localStorage.getItem('usuarioId');

document.getElementById("productList").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../user/product_list.html";
});
document.getElementById("reciboList").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../user/recibo_user.html";
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debes iniciar sesión para ver tus pedidos.');
        window.location.href = '../Html/login.html';
        return;
    }

    fetch('http://localhost:3000/car/pedidos/misPedidos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const orderList = document.getElementById('order-list');
        data.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <h2>Orden #${order.id} - ${new Date(order.fecha).toLocaleDateString()}</h2>
                <p>Total: ${order.total.toFixed(2)} bs.</p>
                <p>Estado: ${order.estado}</p>
                <p>Dirección: ${order.direccion_entrega}</p>
                <h3>Productos:</h3>
                <ul>
                    ${order.DetallePedidos.map(detalle => `
                        <li>${detalle.Producto.nombre} x ${detalle.cantidad} (${detalle.subtotal.toFixed(2)} bs.)</li>
                    `).join('')}
                </ul>
            `;
            orderList.appendChild(orderItem);
        });
    })
    .catch(error => {
        console.error('Error al cargar las órdenes:', error);
        document.getElementById('order-list').innerHTML = `<p>Error al cargar las órdenes. Por favor, inténtalo más tarde.</p>`;
    });
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

document.getElementById("btn-salir").addEventListener("click", (event) => {
    event.preventDefault();

    const confirmLogout = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
        localStorage.clear();
        window.location.href = "../../Html/login.html";
    }
});