// DetalleVentaManager.jsx
// -----------------------------------------------------------------------------
// 8. REGISTRAR DETALLE DE VENTA
// -----------------------------------------------------------------------------
// Muestra el historial de ventas y, al seleccionar una, su detalle (líneas):
// qué variantes se vendieron, cantidad, precio unitario y subtotal.
//
// En un flujo real, VentaRegistro.jsx (componente 7) llamaría a
// onRegistrarVenta(venta, lineas); aquí simplemente recibimos esas ventas
// y detalles ya armados, o usamos datos de ejemplo si no se pasan props.
//
// Props:
//   ventas:         [{ id, fecha, cliente, total }]
//   detalleVentas:  [{ id, ventaId, varianteId, cantidad, precioUnitario }]
//   productos: [{ id, nombre }]
//   tallas:    [{ id, nombre }]
//   colores:   [{ id, nombre, hex }]
//   variantes: [{ id, productoId, tallaId, colorId }]
//   onAgregarLinea(linea): callback opcional para registrar una línea suelta
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

function formatFecha(iso) {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

// Datos de ejemplo para que el componente se pueda ver aislado
const ventasEjemplo = [
  {
    id: 5001,
    fecha: new Date().toISOString(),
    cliente: "María Pérez",
    total: 124000,
  },
];

const detalleEjemplo = [
  { id: 9001, ventaId: 5001, varianteId: 1, cantidad: 2, precioUnitario: 35000 },
  { id: 9002, ventaId: 5001, varianteId: 3, cantidad: 1, precioUnitario: 89000 },
];

export default function DetalleVentaManager({
  ventas: ventasProp,
  detalleVentas: detalleVentasProp,
  productos: productosProp,
  tallas: tallasProp,
  colores: coloresProp,
  variantes: variantesProp,
  onAgregarLinea,
}) {
  const productos = productosProp ?? initialProductos;
  const tallas = tallasProp ?? initialTallas;
  const colores = coloresProp ?? initialColores;
  const variantes = variantesProp ?? initialVariantes;

  const [ventas] = useState(ventasProp ?? ventasEjemplo);
  const [detalleVentas, setDetalleVentas] = useState(
    detalleVentasProp ?? detalleEjemplo
  );

  const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState(
    ventas[0]?.id ?? ""
  );

  function infoVariante(varianteId) {
    const v = variantes.find((x) => x.id === varianteId);
    if (!v) return {};
    return {
      producto: productos.find((p) => p.id === v.productoId),
      talla: tallas.find((t) => t.id === v.tallaId),
      color: colores.find((c) => c.id === v.colorId),
    };
  }

  const lineasDeVenta = detalleVentas.filter(
    (d) => d.ventaId === Number(ventaSeleccionadaId)
  );

  const ventaSeleccionada = ventas.find(
    (v) => v.id === Number(ventaSeleccionadaId)
  );

  const totalCalculado = lineasDeVenta.reduce(
    (acc, l) => acc + l.cantidad * l.precioUnitario,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Detalle de ventas
      </h2>
      <p className="text-slate-500 mb-6">
        Consulta el historial de ventas y el detalle de productos vendidos en
        cada una.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
        {/* Lista de ventas */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <p className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50 border-b border-slate-100">
            Ventas registradas
          </p>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {ventas.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-400 italic">
                No hay ventas registradas.
              </p>
            )}
            {ventas.map((venta) => (
              <button
                key={venta.id}
                onClick={() => setVentaSeleccionadaId(venta.id)}
                className={`w-full text-left px-4 py-3 text-sm transition ${
                  Number(ventaSeleccionadaId) === venta.id
                    ? "bg-indigo-50 border-l-4 border-indigo-600"
                    : "hover:bg-slate-50 border-l-4 border-transparent"
                }`}
              >
                <p className="font-medium text-slate-700">
                  Venta #{venta.id}
                </p>
                <p className="text-xs text-slate-500">{venta.cliente}</p>
                <p className="text-xs text-slate-400">
                  {formatFecha(venta.fecha)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle de la venta seleccionada */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {!ventaSeleccionada ? (
            <p className="p-4 text-sm text-slate-400 italic">
              Selecciona una venta para ver su detalle.
            </p>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    Venta #{ventaSeleccionada.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ventaSeleccionada.cliente} ·{" "}
                    {formatFecha(ventaSeleccionada.fecha)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-indigo-600">
                  {formatCOP(ventaSeleccionada.total ?? totalCalculado)}
                </span>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-left">
                    <th className="px-4 py-2 font-medium">Producto</th>
                    <th className="px-4 py-2 font-medium">Variante</th>
                    <th className="px-4 py-2 font-medium">Cant.</th>
                    <th className="px-4 py-2 font-medium">Precio</th>
                    <th className="px-4 py-2 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {lineasDeVenta.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-4 text-center text-slate-400 italic"
                      >
                        Esta venta no tiene líneas de detalle.
                      </td>
                    </tr>
                  )}
                  {lineasDeVenta.map((linea) => {
                    const { producto, talla, color } = infoVariante(
                      linea.varianteId
                    );
                    return (
                      <tr key={linea.id} className="border-t border-slate-100">
                        <td className="px-4 py-2 text-slate-700">
                          {producto?.nombre}
                        </td>
                        <td className="px-4 py-2 text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-slate-300"
                              style={{ backgroundColor: color?.hex }}
                            />
                            {talla?.nombre} · {color?.nombre}
                          </span>
                        </td>
                        <td className="px-4 py-2">{linea.cantidad}</td>
                        <td className="px-4 py-2">
                          {formatCOP(linea.precioUnitario)}
                        </td>
                        <td className="px-4 py-2 font-medium">
                          {formatCOP(linea.cantidad * linea.precioUnitario)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
