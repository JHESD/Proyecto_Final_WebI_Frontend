document.getElementById("productList").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../admin/business_product_list.html";
});
document.getElementById("pedidosList").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../admin/pedidos_admin.html";
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debes iniciar sesión para ver los pedidos de administrador.');
        window.location.href = '../Html/login.html';
        return;
    }

    fetch('http://localhost:3000/car/pedidos/admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const adminOrdersList = document.getElementById('admin-order-list');
        data.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <h2>Pedido #${order.id} - ${new Date(order.fecha).toLocaleDateString()}</h2>
                <p>Total: $${order.total.toFixed(2)}</p>
                <p>Estado: ${order.estado}</p>
                <p>Usuario: ${order.usuario.nombre_completo}</p>
                <h3>Productos:</h3>
                <ul>
                    ${order.detalles.map(detalle => `
                        <li>${detalle.producto.nombre} x ${detalle.cantidad} ($${detalle.subtotal.toFixed(2)})</li>
                    `).join('')}
                </ul>
            `;
            adminOrdersList.appendChild(orderItem);
        });
    })
    .catch(error => {
        console.error('Error al cargar los pedidos:', error);
        document.getElementById('admin-orders-list').innerHTML = `<p>Error al cargar los pedidos. Por favor, inténtalo más tarde.</p>`;
    });
});

document.getElementById("btn-salir").addEventListener("click", (event) => {
    event.preventDefault();

    const confirmLogout = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
        localStorage.clear();
        alert("Sesión cerrada con éxito.");
        window.location.href = "../../Html/login.html";
    }
});