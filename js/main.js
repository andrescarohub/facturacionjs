

document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productosContainer');
    const agregarProductoBtn = document.getElementById('agregarProducto');
    const resumenProductos = document.getElementById('resumenProductos');
    const subtotalElement = document.getElementById('subtotal');
    const ivaElement = document.getElementById('iva');
    const totalElement = document.getElementById('total');
    const botonPagar = document.getElementById('botonPagar');
    const botonNuevaFactura = document.getElementById('botonNuevaFactura');

    let productosCounter = 1;

    agregarProductoBtn.addEventListener('click', () => {
        const nuevoProductoRow = document.createElement('div');
        nuevoProductoRow.classList.add('producto-row', 'mb-3');
        nuevoProductoRow.innerHTML = `
            <div class="row">
                <div class="col-md-3">
                    <input type="text" class="form-control producto-codigo">
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control producto-nombre">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control producto-valor">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control producto-cantidad" value="1">
                </div>
                <div class="col-md-1 align-self-end">
                    <button class="btn btn-danger btn-sm eliminar-producto">-</button>
                </div>
            </div>
        `;
        productosContainer.appendChild(nuevoProductoRow);

        nuevoProductoRow.querySelector('.eliminar-producto').addEventListener('click', () => {
            productosContainer.removeChild(nuevoProductoRow);
            calcularTotales();
        });

        const inputs = nuevoProductoRow.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calcularTotales);
        });
    });

    function calcularTotales() {
        const productos = document.querySelectorAll('.producto-row');
        let subtotal = 0;
        resumenProductos.innerHTML = '';

        productos.forEach(producto => {
            const codigo = producto.querySelector('.producto-codigo').value;
            const nombre = producto.querySelector('.producto-nombre').value;
            const valor = parseFloat(producto.querySelector('.producto-valor').value) || 0;
            const cantidad = parseInt(producto.querySelector('.producto-cantidad').value) || 1;
            
            if (codigo && nombre && valor > 0) {
                const totalProducto = valor * cantidad;
                subtotal += totalProducto;

                const filaResumen = document.createElement('tr');
                filaResumen.innerHTML = `
                    <td>${codigo}</td>
                    <td>${nombre}</td>
                    <td>$${valor.toFixed(2)}</td>
                    <td>${cantidad}</td>
                    <td>$${totalProducto.toFixed(2)}</td>
                `;
                resumenProductos.appendChild(filaResumen);
            }
        });

        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        ivaElement.textContent = `$${iva.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    botonPagar.addEventListener('click', () => {
        alert('Pago realizado con éxito');
    });

    botonNuevaFactura.addEventListener('click', () => {
        // Resetear todos los campos
        document.getElementById('facturaNumero').value = '';
        document.getElementById('clienteNombres').value = '';
        document.getElementById('clienteApellidos').value = '';
        document.getElementById('clienteDireccion').value = '';
        document.getElementById('clienteEmail').value = '';

        // Mantener solo una fila de producto
        const rows = document.querySelectorAll('.producto-row');
        rows.forEach((row, index) => {
            if (index > 0) row.remove();
        });

        // Limpiar inputs de la primera fila
        const primeraFila = document.querySelector('.producto-row');
        primeraFila.querySelectorAll('input').forEach(input => {
            input.value = input.type === 'number' ? '1' : '';
        });

        // Resetear totales
        calcularTotales();
    });

    // Calcular totales inicialmente
    calcularTotales();
});