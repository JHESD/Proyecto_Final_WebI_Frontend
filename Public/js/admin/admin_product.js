const negocioId = localStorage.getItem('negocioId');
if (!negocioId) {
    alert("No se encontró el ID del negocio. Por favor, inicie sesión nuevamente.");
    window.location.href = "../Html/login.html";
}
const containerProductos = document.querySelector('.container-products');


async function obtenerProductosPorNegocio() {
    try {
        const response = await fetch(`http://localhost:3000/product/negocio/${negocioId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Enviar token si es necesario
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }

        const productos = await response.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error(error);
        containerProductos.innerHTML = `<p>Error al cargar productos.</p>`;
    }
}

function getProductoInHTML(producto) {
    const img = (producto.imagenes && producto.imagenes.length > 0) 
        ? `http://localhost:3000${producto.imagenes[0].url_imagen}`
        : `../../img/comida.jpg`;

    return `
        <div class="card-product" data-id="${producto.id}">
            <div class="container-img">
                <img src="${img}" alt="${producto.nombre}" />
                <div class="button-group">
                    <span class="delete-product" data-id="${producto.id}" data-action="desactivar">
                        <i class="fa-solid fa-trash"></i>
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
                <span class="add-cart edit-product" data-id="${producto.id}">
                    <i class="fa-solid fa-pencil"></i>
                </span>
                <p class="price">${producto.precio.toFixed(2)} Bs.</p>
            </div>
        </div>`;
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

function agregarEventosProductos() {
    const botonesEditar = document.querySelectorAll('.edit-product');
    botonesEditar.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const productoId = e.target.closest('.edit-product').dataset.id;
            window.location.href = `./business_product_update.html?id=${productoId}`;
        });
    });

    const titulosDetalle = document.querySelectorAll('.view-detail');
    titulosDetalle.forEach((titulo) => {
        titulo.addEventListener('click', (e) => {
            const productoId = e.target.dataset.id;
            window.location.href = `./business_product_detail.html?id=${productoId}`;
        });
    });
}

document.addEventListener("click", async (event) => {
    const target = event.target.closest(".delete-product");
    if (!target) return;

    const productId = target.dataset.id;
    const action = target.dataset.action;

    if (action === "desactivar") {
        const confirmAction = confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmAction) return;

        try {
            const response = await fetch(`http://localhost:3000/product/prd/${productId}/desactivar`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Producto eliminado con éxito");
                const card = document.querySelector(`.card-product[data-id="${productId}"]`);
                if (card) card.classList.add("inactive");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error al desactivar el producto:", error);
            alert("Error al desactivar el producto. Inténtalo nuevamente.");
        }
    }
});

obtenerProductosPorNegocio();

document.querySelector('.floating-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "../admin/business_product_create.html";
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