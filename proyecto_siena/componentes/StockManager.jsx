// StockManager.jsx
// -----------------------------------------------------------------------------
// 4. MODIFICAR STOCK Y CONSULTAR DISPONIBILIDAD
// -----------------------------------------------------------------------------
// Por cada variante (producto + talla + color) permite:
//   - Sumar o restar stock (entradas / salidas manuales)
//   - Ver disponibilidad en tiempo real con indicador visual
//   - Buscar/filtrar por nombre de producto
//
// Props:
//   productos: [{ id, nombre }]
//   tallas:    [{ id, nombre }]
//   colores:   [{ id, nombre, hex }]
//   variantes: [{ id, productoId, tallaId, colorId, stock }]
//   onActualizarStock(varianteId, nuevoStock): callback al cambiar stock
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import {
  initialProductos,
  initialTallas,
  initialColores,
  initialVariantes,
} from "./store";

const UMBRAL_BAJO = 5;

export default function StockManager({
  productos: productosProp,
  tallas: tallasProp,
  colores: coloresProp,
  variantes: variantesProp,
  onActualizarStock,
}) {
  const productos = productosProp ?? initialProductos;
  const tallas = tallasProp ?? initialTallas;
  const colores = coloresProp ?? initialColores;

  const [variantes, setVariantes] = useState(
    variantesProp ?? initialVariantes
  );
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState({}); // { varianteId: cantidadAjuste }

  const nombreProducto = (id) =>
    productos.find((p) => p.id === id)?.nombre ?? "—";
  const nombreTalla = (id) => tallas.find((t) => t.id === id)?.nombre ?? "—";
  const colorInfo = (id) => colores.find((c) => c.id === id);

  const variantesFiltradas = variantes.filter((v) =>
    nombreProducto(v.productoId)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  function setCantidadAjuste(varianteId, valor) {
    setCantidades((prev) => ({ ...prev, [varianteId]: valor }));
  }

  function ajustarStock(varianteId, signo) {
    const cantidad = Number(cantidades[varianteId]) || 0;
    if (cantidad <= 0) return;

    setVariantes((prev) =>
      prev.map((v) => {
        if (v.id !== varianteId) return v;
        const nuevoStock = Math.max(0, v.stock + signo * cantidad);
        onActualizarStock?.(varianteId, nuevoStock);
        return { ...v, stock: nuevoStock };
      })
    );

    setCantidadAjuste(varianteId, "");
  }

  function estadoDisponibilidad(stock) {
    if (stock === 0)
      return { texto: "Agotado", clase: "bg-red-100 text-red-700" };
    if (stock <= UMBRAL_BAJO)
      return { texto: "Stock bajo", clase: "bg-amber-100 text-amber-700" };
    return { texto: "Disponible", clase: "bg-emerald-100 text-emerald-700" };
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Stock y disponibilidad
      </h2>
      <p className="text-slate-500 mb-6">
        Ajusta el inventario de cada variante y consulta su disponibilidad.
      </p>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full sm:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left">
              <th className="px-4 py-2.5 font-medium">Producto</th>
              <th className="px-4 py-2.5 font-medium">Talla</th>
              <th className="px-4 py-2.5 font-medium">Color</th>
              <th className="px-4 py-2.5 font-medium">Stock</th>
              <th className="px-4 py-2.5 font-medium">Disponibilidad</th>
              <th className="px-4 py-2.5 font-medium">Ajustar</th>
            </tr>
          </thead>
          <tbody>
            {variantesFiltradas.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-400 italic"
                >
                  No se encontraron variantes.
                </td>
              </tr>
            )}

            {variantesFiltradas.map((v) => {
              const color = colorInfo(v.colorId);
              const estado = estadoDisponibilidad(v.stock);

              return (
                <tr key={v.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-700">
                    {nombreProducto(v.productoId)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {nombreTalla(v.tallaId)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: color?.hex ?? "#ccc" }}
                      />
                      {color?.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">
                    {v.stock}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${estado.clase}`}
                    >
                      {estado.texto}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={cantidades[v.id] ?? ""}
                        onChange={(e) =>
                          setCantidadAjuste(v.id, e.target.value)
                        }
                        className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <button
                        onClick={() => ajustarStock(v.id, 1)}
                        title="Agregar stock (entrada)"
                        className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => ajustarStock(v.id, -1)}
                        title="Restar stock (salida)"
                        className="w-7 h-7 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-bold"
                      >
                        −
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
