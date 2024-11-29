const API_BASE_URL = 'http://localhost:3000';
const containerProductos = document.querySelector('.container-products');
const categorySelect = document.getElementById('category-select');
const usuarioId = localStorage.getItem('usuarioId');

document.getElementById('productList').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../user/product_list.html';
});

document.getElementById('reciboList').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../user/recibo_user.html';
});

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
    categorySelect.innerHTML = '<option value="">Todas las Categorías</option>';
    categorias.forEach((categoria) => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        categorySelect.appendChild(option);
    });
}

async function obtenerProductosPorCategoria(categoriaId = '') {
    try {
        const url = categoriaId 
            ? `${API_BASE_URL}/product/productos/categoria/${categoriaId}` 
            : `${API_BASE_URL}/product/prd`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) throw new Error('Los productos tal vez no existen');
        const productos = await response.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        containerProductos.innerHTML = `<p>Los productos tal vez no existen...</p>`;
    }
}

function renderizarProductos(productos) {
    containerProductos.innerHTML = '';
    if (productos.length === 0) {
        containerProductos.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }

    productos.forEach((producto) => {
        containerProductos.innerHTML += getProductoInHTML(producto);
    });

    agregarEventosProductos();
}

function getProductoInHTML(producto) {
    const img = (producto.Imagens && producto.Imagens.length > 0)
        ? `${API_BASE_URL}${producto.Imagens[0].url_imagen}`
        : `../../img/comida.jpg`;

    return `
        <div class="card-product" data-id="${producto.id}">
            <div class="container-img">
                <img src="${img}" alt="${producto.nombre}" />
                <div class="button-group">
                    <span>
                        <i class="fa-regular fa-eye"></i>
                    </span>
                    <span>
                        <i class="fa-regular fa-heart"></i>
                    </span>
                </div>
            </div>
            <div class="content-card-product">
                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                </div>
                <h3 class="view-detail" data-id="${producto.id}">${producto.nombre}</h3>
                <p class="price">${producto.precio.toFixed(2)} Bs.</p>
            </div>
        </div>`;
}

function agregarEventosProductos() {
    const titulosDetalle = document.querySelectorAll('.view-detail');
    titulosDetalle.forEach((titulo) => {
        titulo.addEventListener('click', (e) => {
            const productoId = e.target.dataset.id;
            window.location.href = `./product_detail.html?id=${productoId}`;
        });
    });
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


async function inicializar() {
    await obtenerCategorias();
    await obtenerProductosPorCategoria();
}

categorySelect.addEventListener('change', (event) => {
    const categoriaId = event.target.value;
    obtenerProductosPorCategoria(categoriaId);
});

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

    inicializar();
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