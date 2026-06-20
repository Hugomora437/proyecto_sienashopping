// VariantesManager.jsx
// -----------------------------------------------------------------------------
// 3. CREAR VARIANTES EVITANDO DUPLICADOS
// -----------------------------------------------------------------------------
// Una variante es la combinación única de: producto + talla + color.
// Este componente:
//   - Permite crear una nueva variante
//   - Valida que NO exista ya otra variante con el mismo producto+talla+color
//   - Lista las variantes existentes agrupadas por producto
//
// Props:
//   productos: [{ id, nombre }]
//   tallas:    [{ id, nombre }]
//   colores:   [{ id, nombre, hex }]
//   variantes: [{ id, productoId, tallaId, colorId, stock }]
//   onCrearVariante(variante): callback al crear con éxito
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import {
  initialProductos,
  initialTallas,
  initialColores,
  initialVariantes,
  genId,
} from "./store";

export default function VariantesManager({
  productos: productosProp,
  tallas: tallasProp,
  colores: coloresProp,
  variantes: variantesProp,
  onCrearVariante,
}) {
  const productos = productosProp ?? initialProductos;
  const tallas = tallasProp ?? initialTallas;
  const colores = coloresProp ?? initialColores;

  const [variantes, setVariantes] = useState(
    variantesProp ?? initialVariantes
  );

  const [productoId, setProductoId] = useState(productos[0]?.id ?? "");
  const [tallaId, setTallaId] = useState(tallas[0]?.id ?? "");
  const [colorId, setColorId] = useState(colores[0]?.id ?? "");
  const [stockInicial, setStockInicial] = useState(0);

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const nombreProducto = (id) =>
    productos.find((p) => p.id === id)?.nombre ?? "—";
  const nombreTalla = (id) => tallas.find((t) => t.id === id)?.nombre ?? "—";
  const colorInfo = (id) => colores.find((c) => c.id === id);

  function existeDuplicado(pId, tId, cId) {
    return variantes.some(
      (v) => v.productoId === pId && v.tallaId === tId && v.colorId === cId
    );
  }

  function crearVariante(e) {
    e.preventDefault();
    setExito("");

    const pId = Number(productoId);
    const tId = Number(tallaId);
    const cId = Number(colorId);

    if (!pId || !tId || !cId) {
      setError("Selecciona producto, talla y color.");
      return;
    }

    if (existeDuplicado(pId, tId, cId)) {
      setError(
        `Ya existe una variante de "${nombreProducto(pId)}" en talla ${nombreTalla(
          tId
        )} y color ${colorInfo(cId)?.nombre}. No se permiten duplicados.`
      );
      return;
    }

    const nuevaVariante = {
      id: genId(),
      productoId: pId,
      tallaId: tId,
      colorId: cId,
      stock: Math.max(0, Number(stockInicial) || 0),
    };

    setVariantes((prev) => [...prev, nuevaVariante]);
    onCrearVariante?.(nuevaVariante);

    setError("");
    setExito("Variante creada correctamente.");
    setStockInicial(0);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Variantes de producto
      </h2>
      <p className="text-slate-500 mb-6">
        Combina producto, talla y color. No se permiten combinaciones repetidas.
      </p>

      <form
        onSubmit={crearVariante}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm"
      >
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Producto
          </label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Talla
          </label>
          <select
            value={tallaId}
            onChange={(e) => setTallaId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {tallas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Color
          </label>
          <select
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {colores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Stock inicial
          </label>
          <input
            type="number"
            min="0"
            value={stockInicial}
            onChange={(e) => setStockInicial(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
              {error}
            </p>
          )}
          {exito && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-2">
              {exito}
            </p>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Crear variante
          </button>
        </div>
      </form>

      <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
        Variantes existentes
      </h3>

      <div className="space-y-2">
        {variantes.length === 0 && (
          <p className="text-slate-400 text-sm italic">
            Aún no se han creado variantes.
          </p>
        )}

        {variantes.map((v) => {
          const color = colorInfo(v.colorId);
          return (
            <div
              key={v.id}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: color?.hex ?? "#ccc" }}
                  title={color?.nombre}
                />
                <span className="text-sm text-slate-700">
                  <span className="font-medium">{nombreProducto(v.productoId)}</span>
                  {" · talla "}
                  {nombreTalla(v.tallaId)}
                  {" · "}
                  {color?.nombre}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Stock: {v.stock}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
