// VentaRegistro.jsx
// -----------------------------------------------------------------------------
// 7. REGISTRAR VENTAS
// -----------------------------------------------------------------------------
// Permite armar una venta agregando variantes al "carrito", valida que haya
// stock suficiente, calcula el total y al confirmar:
//   - Crea el registro de venta (cabecera)
//   - Descuenta el stock de cada variante vendida
//
// El detalle de venta (líneas) se maneja en DetalleVentaManager.jsx, que
// puede recibir la venta creada aquí vía onRegistrarVenta.
//
// Props:
//   productos: [{ id, nombre, precio }]
//   tallas:    [{ id, nombre }]
//   colores:   [{ id, nombre, hex }]
//   variantes: [{ id, productoId, tallaId, colorId, stock }]
//   onRegistrarVenta(venta, lineas): callback con la venta creada y sus líneas
//   onActualizarStock(varianteId, nuevoStock): callback al descontar stock
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import {
  initialProductos,
  initialTallas,
  initialColores,
  initialVariantes,
  genId,
} from "./store";

function formatCOP(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function VentaRegistro({
  productos: productosProp,
  tallas: tallasProp,
  colores: coloresProp,
  variantes: variantesProp,
  onRegistrarVenta,
  onActualizarStock,
}) {
  const productos = productosProp ?? initialProductos;
  const tallas = tallasProp ?? initialTallas;
  const colores = coloresProp ?? initialColores;

  const [variantes, setVariantes] = useState(
    variantesProp ?? initialVariantes
  );

  const [varianteId, setVarianteId] = useState(variantes[0]?.id ?? "");
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]); // [{ varianteId, cantidad, precioUnitario }]
  const [cliente, setCliente] = useState("");
  const [error, setError] = useState("");
  const [ventaConfirmada, setVentaConfirmada] = useState(null);

  function info(v) {
    const producto = productos.find((p) => p.id === v.productoId);
    const talla = tallas.find((t) => t.id === v.tallaId);
    const color = colores.find((c) => c.id === v.colorId);
    return { producto, talla, color };
  }

  function agregarAlCarrito(e) {
    e.preventDefault();
    setError("");

    const variante = variantes.find((v) => v.id === Number(varianteId));
    if (!variante) return;

    const cantidadNum = Number(cantidad);
    if (cantidadNum <= 0) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }

    const yaEnCarrito = carrito.find((l) => l.varianteId === variante.id);
    const cantidadAcumulada = (yaEnCarrito?.cantidad ?? 0) + cantidadNum;

    if (cantidadAcumulada > variante.stock) {
      setError(
        `Stock insuficiente. Disponible: ${variante.stock}, solicitado: ${cantidadAcumulada}.`
      );
      return;
    }

    const { producto } = info(variante);

    setCarrito((prev) => {
      if (yaEnCarrito) {
        return prev.map((l) =>
          l.varianteId === variante.id
            ? { ...l, cantidad: cantidadAcumulada }
            : l
        );
      }
      return [
        ...prev,
        {
          varianteId: variante.id,
          cantidad: cantidadNum,
          precioUnitario: producto.precio,
        },
      ];
    });

    setCantidad(1);
  }

  function quitarLinea(varianteId) {
    setCarrito((prev) => prev.filter((l) => l.varianteId !== varianteId));
  }

  const total = carrito.reduce(
    (acc, l) => acc + l.cantidad * l.precioUnitario,
    0
  );

  function confirmarVenta() {
    if (carrito.length === 0) {
      setError("Agrega al menos un producto al carrito.");
      return;
    }

    const venta = {
      id: genId(),
      fecha: new Date().toISOString(),
      cliente: cliente.trim() || "Cliente general",
      total,
    };

    // Descontar stock de cada variante vendida
    setVariantes((prev) =>
      prev.map((v) => {
        const linea = carrito.find((l) => l.varianteId === v.id);
        if (!linea) return v;
        const nuevoStock = v.stock - linea.cantidad;
        onActualizarStock?.(v.id, nuevoStock);
        return { ...v, stock: nuevoStock };
      })
    );

    onRegistrarVenta?.(venta, carrito);

    setVentaConfirmada(venta);
    setCarrito([]);
    setCliente("");
    setError("");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Registrar venta
      </h2>
      <p className="text-slate-500 mb-6">
        Agrega variantes al carrito y confirma la venta. El stock se descuenta
        automáticamente.
      </p>

      {ventaConfirmada && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
          Venta #{ventaConfirmada.id} registrada para{" "}
          <strong>{ventaConfirmada.cliente}</strong> por{" "}
          <strong>{formatCOP(ventaConfirmada.total)}</strong>.
        </div>
      )}

      <form
        onSubmit={agregarAlCarrito}
        className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-xl p-4 mb-5 shadow-sm"
      >
        <select
          value={varianteId}
          onChange={(e) => setVarianteId(e.target.value)}
          className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {variantes.map((v) => {
            const { producto, talla, color } = info(v);
            return (
              <option key={v.id} value={v.id} disabled={v.stock === 0}>
                {producto?.nombre} · {talla?.nombre} · {color?.nombre}{" "}
                {v.stock === 0 ? "(agotado)" : `(stock: ${v.stock})`}
              </option>
            );
          })}
        </select>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Agregar
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-5">
        {carrito.length === 0 ? (
          <p className="text-slate-400 text-sm italic p-4">
            El carrito está vacío.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-4 py-2 font-medium">Producto</th>
                <th className="px-4 py-2 font-medium">Cant.</th>
                <th className="px-4 py-2 font-medium">Precio</th>
                <th className="px-4 py-2 font-medium">Subtotal</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((l) => {
                const variante = variantes.find((v) => v.id === l.varianteId);
                const { producto, talla, color } = info(variante);
                return (
                  <tr key={l.varianteId} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-700">
                      {producto?.nombre}{" "}
                      <span className="text-slate-400">
                        ({talla?.nombre}, {color?.nombre})
                      </span>
                    </td>
                    <td className="px-4 py-2">{l.cantidad}</td>
                    <td className="px-4 py-2">
                      {formatCOP(l.precioUnitario)}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {formatCOP(l.cantidad * l.precioUnitario)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => quitarLinea(l.varianteId)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Cliente (opcional)
          </label>
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-800 mb-2">
            {formatCOP(total)}
          </p>
          <button
            onClick={confirmarVenta}
            className="px-5 py-2.5 text-sm rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            Confirmar venta
          </button>
        </div>
      </div>
    </div>
  );
}
