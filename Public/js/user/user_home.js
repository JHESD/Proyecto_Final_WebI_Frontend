const API_BASE_URL = 'http://localhost:3000';
const usuarioId = localStorage.getItem('usuarioId');

document.getElementById('productList').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../user/product_list.html';
});

document.getElementById('reciboList').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../user/recibo_user.html';
});

const list = document.querySelector('.slider .list');
const items = document.querySelectorAll('.slider .list .item');
const dots = document.querySelectorAll('.slider .dots li');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let active = 0;
const lengthItems = items.length - 1;

next.onclick = () => {
    active = (active + 1 > lengthItems) ? 0 : active + 1;
    reloadSlider();
};

prev.onclick = () => {
    active = (active - 1 < 0) ? lengthItems : active - 1;
    reloadSlider();
};

dots.forEach((li, key) => {
    li.addEventListener('click', () => {
        active = key;
        reloadSlider();
    });
});

let refreshSlider = setInterval(() => {
    next.click();
}, 5000);

function reloadSlider() {
    const checkLeft = items[active].offsetLeft;
    list.style.left = -checkLeft + 'px';

    const lastActiveDot = document.querySelector('.slider .dots li.active');
    if (lastActiveDot) lastActiveDot.classList.remove('active');

    dots[active].classList.add('active');
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => {
        next.click();
    }, 5000);
}

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

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    menu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            menu.classList.remove('show');
        }
    }); 
    actualizarNumeroCarrito();
});

document.getElementById("btn-salir").addEventListener("click", (event) => {
    event.preventDefault();

    const confirmLogout = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
        localStorage.clear();
        window.location.href = "../../Html/login.html";
    }
});