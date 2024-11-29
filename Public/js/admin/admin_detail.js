const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

console.log("ID del producto:", productId);

if (productId) {
    fetch(`http://localhost:3000/product/prd/${productId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del producto');
            }
            return response.json();
        })
        .then((producto) => {
            console.log(producto);
            document.getElementById('product-name').textContent = producto.nombre || 'Sin nombre';
            document.getElementById('business-name').textContent = producto.Negocio?.nombre || 'Sin empresa';
            document.getElementById('category-name').textContent = producto.Categorium?.nombre || 'Sin categoría';
            document.getElementById('product-price').textContent = producto.precio?.toFixed(2) || '0.00';
            document.getElementById('product-description').textContent = producto.descripcion || 'Sin descripción.';
        })
        .catch((error) => {
            console.error(error);
            alert('No se pudo cargar el detalle del producto.');
        });
} else {
    alert('ID de producto no especificado en la URL.');
}

document.getElementById("btn-salir").addEventListener("click", (event) => {
    event.preventDefault();

    const confirmLogout = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
        localStorage.clear();
        alert("Sesión cerrada con éxito.");
        window.location.href = "../../Html/login.html";
    }
});