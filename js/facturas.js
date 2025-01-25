import inventario from './inventario.js';

const facturas = [];

class FacturacionElectronica {
    constructor() {
        this.facturas = facturas;
    }

    generarFactura(datosCliente, productos) {
        const factura = {
            numero: this.generarNumeroFactura(),
            fecha: new Date().toISOString(),
            cliente: datosCliente,
            productos: productos,
            subtotal: this.calcularSubtotal(productos),
            iva: this.calcularIVA(productos),
            total: this.calcularTotal(productos)
        };

        this.facturas.push(factura);
        this.actualizarInventario(productos);
        this.guardarCompra(factura);
        return factura;
    }

    generarNumeroFactura() {
        return `FACT-${(this.facturas.length + 1).toString().padStart(5, '0')}`;
    }

    calcularSubtotal(productos) {
        return productos.reduce((total, prod) => total + (prod.valor * prod.cantidad), 0);
    }

    calcularIVA(productos) {
        return this.calcularSubtotal(productos) * 0.19;
    }

    calcularTotal(productos) {
        const subtotal = this.calcularSubtotal(productos);
        return subtotal + this.calcularIVA(productos);
    }

    actualizarInventario(productos) {
        productos.forEach(producto => {
            const productoEnInventario = inventario.find(p => p.codigo === producto.codigo);
            if (productoEnInventario) {
                productoEnInventario.stock -= producto.cantidad;
            }
        });
    }

    guardarCompra(factura) {
        const compras = JSON.parse(localStorage.getItem('compras') || '[]');
        compras.push(factura);
        localStorage.setItem('compras', JSON.stringify(compras));
    }
}

export default new FacturacionElectronica();