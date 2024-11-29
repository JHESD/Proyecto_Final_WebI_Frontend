// |Carusel de imágenes - Inicio|
let list = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let dots = document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');
let active = 0;
let lengthItems = items.length - 1;

next.onclick = function() {
    if (active + 1 > lengthItems) {
        active = 0;
    } else {
        active = active + 1;
    }
    reloadSlider();
};
prev.onclick = function() {
    if (active - 1 < 0) {
        active = lengthItems;
    } else {
        active = active - 1;
    }
    reloadSlider();
};
dots.forEach((li, key) => {
    li.addEventListener('click', function() {
        active = key;
        reloadSlider();
    });
});
let refreshSlider = setInterval(() => { next.click(); }, 5000);

function reloadSlider() {
    let checkLeft = items[active].offsetLeft;
    list.style.left = -checkLeft + 'px';

    let lastActiveDot = document.querySelector('.slider .dots li.active');
    lastActiveDot.classList.remove('active');
    dots[active].classList.add('active');
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => { next.click(); }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const negocioId = localStorage.getItem('negocioId');

    if (!isAdmin || !negocioId) {
        alert("No tiene permisos para acceder a esta sección. Por favor, inicie sesión nuevamente.");
        localStorage.clear(); // Limpiar cualquier dato residual
        window.location.href = "../Html/login.html";
    }
});

document.getElementById("productList").addEventListener("click", function(event) {
    event.preventDefault();

    const negocioId = localStorage.getItem('negocioId');
    if (!negocioId) {
        alert("No se encontró el ID del negocio. Por favor, inicie sesión nuevamente.");
        localStorage.clear();
        window.location.href = "../../Html/login.html";
        return;
    }

    window.location.href = `../admin/business_product_list.html?negocioId=${negocioId}`;
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
