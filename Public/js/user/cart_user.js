const API_BASE_URL = 'http://localhost:3000';
const usuarioId = localStorage.getItem('usuarioId');

if (!usuarioId) {
    console.error('El usuario no ha iniciado sesión. Redirigiendo al login...');
    window.location.href = '/login.html';
}

async function obtenerCantidadCarrito() {
    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${usuarioId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.productos.reduce((acc, producto) => acc + producto.cantidad, 0);
        } else if (response.status === 404) {
            console.log('El carrito está vacío.');
            return 0;
        } else {
            const errorText = await response.text();
            console.error('Error al obtener el carrito:', errorText);
            return 0;
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        return 0;
    }
}

async function actualizarNumeroCarrito() {
    const cantidad = await obtenerCantidadCarrito();
    const numeroCarrito = document.querySelector('.container-user .number');
    if (numeroCarrito) {
        numeroCarrito.textContent = `(${cantidad})`;
    }
}

async function loadCart() {
    const cartTableBody = document.querySelector("#cartTable tbody");
    const cartTotal = document.querySelector("#cartTotal");

    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${usuarioId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) throw new Error(`Error al obtener el carrito: ${response.status}`);

        const data = await response.json();
        cartTableBody.innerHTML = "";
        cartTotal.textContent = `${data.total.toFixed(2)}`;

        data.productos.forEach((producto) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.precio.toFixed(2)} bs.</td>
                <td>
                    <input type="number" value="${producto.cantidad}" min="1" class="quantity-input" data-product-id="${producto.id}">
                </td>
                <td>${producto.subtotal.toFixed(2)} bs.</td>
                <td>
                    <button class="remove-btn" data-product-id="${producto.id}">Eliminar</button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });

        attachEventListeners();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function obtenerPedidoId() {
    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${usuarioId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            console.error('No se encontró el carrito.');
            return null;
        }

        const data = await response.json();
        return data.pedidoId;
    } catch (error) {
        console.error('Error al obtener el pedido activo:', error);
        return null;
    }
}


async function updateCartItem(productId, newQuantity) {
    const pedidoId = await obtenerPedidoId();

    if (!pedidoId) {
        alert('No se pudo obtener el pedido activo.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${pedidoId}/product/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cantidad: newQuantity }),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el producto. Status: ${response.status}`);
        }

        await loadCart();
        actualizarNumeroCarrito();
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo actualizar la cantidad.");
    }
}


async function removeCartItem(productId) {
    const pedidoId = await obtenerPedidoId();
    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${pedidoId}/product/${productId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar el producto");
        await loadCart();
        actualizarNumeroCarrito();
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar el producto.");
    }
}

async function confirmPurchase() {
    try {
        const response = await fetch(`${API_BASE_URL}/car/cart/${usuarioId}/confirm`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) throw new Error("Error al confirmar la compra");

        await loadCart();
        actualizarNumeroCarrito();
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo confirmar la compra.");
    }
}

function attachEventListeners() {
    document.querySelectorAll(".quantity-input").forEach((input) => {
        input.addEventListener("change", (e) => {
            const productId = e.target.dataset.productId;
            const newQuantity = parseInt(e.target.value, 10);
            updateCartItem(productId, newQuantity);
        });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const productId = e.target.dataset.productId;
            removeCartItem(productId);
        });
    });

    const confirmPurchaseBtn = document.querySelector("#confirmPurchaseBtn");
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener("click", confirmPurchase);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await actualizarNumeroCarrito();
    await loadCart();
});