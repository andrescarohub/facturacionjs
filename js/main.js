import inventario from './inventario.js';
import facturacion from './facturas.js';

document.addEventListener('DOMContentLoaded', () => {
    const productosSelector = document.querySelector('.producto-selector');
    const productosContainer = document.getElementById('productosContainer');
    const agregarProductoBtn = document.getElementById('agregarProducto');
    const botonPagar = document.getElementById('botonPagar');
    const subtotalElement = document.getElementById('subtotal');
    const ivaElement = document.getElementById('iva');
    const totalElement = document.getElementById('total');

    function cargarProductosSelector() {
        inventario.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.codigo;
            option.textContent = producto.nombre;
            productosSelector.appendChild(option);
        });
    }
    cargarProductosSelector();

    agregarProductoBtn.addEventListener('click', () => {
        const codigoSeleccionado = productosSelector.value;
        const productoSeleccionado = inventario.find(p => p.codigo === codigoSeleccionado);

        if (productoSeleccionado) {
            const nuevoProductoRow = document.createElement('div');
            nuevoProductoRow.classList.add('row', 'mb-2');
            nuevoProductoRow.innerHTML = `
                <div class="col-md-4">
                    <input type="text" class="form-control producto-nombre" value="${productoSeleccionado.nombre}" readonly>
                </div>
                <div class="col-md-2">
                    <input type="text" class="form-control producto-codigo" value="${productoSeleccionado.codigo}" readonly>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control producto-valor" value="${productoSeleccionado.precio}" readonly>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control producto-cantidad" value="1" min="1">
                </div>
                <div class="col-md-2">
                    <button class="btn btn-danger btn-sm eliminar-producto">Eliminar</button>
                </div>
            `;

            productosContainer.appendChild(nuevoProductoRow);

            nuevoProductoRow.querySelector('.eliminar-producto').addEventListener('click', () => {
                productosContainer.removeChild(nuevoProductoRow);
                calcularTotales();
            });

            calcularTotales();
        }
    });

    function calcularTotales() {
        const productos = document.querySelectorAll('.producto-row');
        let subtotal = 0;

        productos.forEach(producto => {
            const valor = parseFloat(producto.querySelector('.producto-valor').value) || 0;
            const cantidad = parseInt(producto.querySelector('.producto-cantidad').value) || 1;
            subtotal += valor * cantidad;
        });

        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        ivaElement.textContent = `$${iva.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    botonPagar.addEventListener('click', () => {
        const productos = document.querySelectorAll('.row');
        const productosFactura = [];

        productos.forEach(producto => {
            const codigo = producto.querySelector('.producto-codigo')?.value;
            const nombre = producto.querySelector('.producto-nombre')?.value;
            const valor = parseFloat(producto.querySelector('.producto-valor')?.value);
            const cantidad = parseInt(producto.querySelector('.producto-cantidad')?.value);

            if (codigo && nombre && valor && cantidad) {
                productosFactura.push({ codigo, nombre, valor, cantidad });
            }
        });

        const datosCliente = {
            nombres: document.getElementById('clienteNombres').value,
            apellidos: document.getElementById('clienteApellidos').value,
            email: document.getElementById('clienteEmail').value
        };

        const facturaGenerada = facturacion.generarFactura(datosCliente, productosFactura);
        alert('Compra realizada');

        // Resetear formulario
        productosContainer.innerHTML = '';
        document.getElementById('clienteNombres').value = '';
        document.getElementById('clienteApellidos').value = '';
        document.getElementById('clienteEmail').value = '';
        calcularTotales();
    });
});