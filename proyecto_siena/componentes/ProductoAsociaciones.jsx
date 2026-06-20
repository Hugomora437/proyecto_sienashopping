// ProductoAsociaciones.jsx
// -----------------------------------------------------------------------------
// 6. ASOCIAR PRODUCTOS A CATEGORÍAS Y VARIANTES
// -----------------------------------------------------------------------------
// Permite:
//   - Cambiar la categoría de un producto (relación producto -> categoría)
//   - Ver y crear las variantes (talla + color) ya asociadas a ese producto
//     reutilizando la misma validación de duplicados
//
// Este componente complementa a VariantesManager: aquí el foco es "desde
// el producto" en lugar de "desde el formulario general de variantes".
//
// Props:
//   productos:  [{ id, nombre, categoriaId }]
//   categorias: [{ id, nombre }]
//   tallas:     [{ id, nombre }]
//   colores:    [{ id, nombre, hex }]
//   variantes:  [{ id, productoId, tallaId, colorId, stock }]
//   onCambiarCategoria(productoId, categoriaId)
//   onCrearVariante(variante)
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import {
  initialProductos,
  initialCategorias,
  initialTallas,
  initialColores,
  initialVariantes,
  genId,
} from "./store";

export default function ProductoAsociaciones({
  productos: productosProp,
  categorias: categoriasProp,
  tallas: tallasProp,
  colores: coloresProp,
  variantes: variantesProp,
  onCambiarCategoria,
  onCrearVariante,
}) {
  const categorias = categoriasProp ?? initialCategorias;
  const tallas = tallasProp ?? initialTallas;
  const colores = coloresProp ?? initialColores;

  const [productos, setProductos] = useState(productosProp ?? initialProductos);
  const [variantes, setVariantes] = useState(
    variantesProp ?? initialVariantes
  );

  const [productoId, setProductoId] = useState(productos[0]?.id ?? "");
  const [tallaId, setTallaId] = useState(tallas[0]?.id ?? "");
  const [colorId, setColorId] = useState(colores[0]?.id ?? "");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const productoActual = productos.find((p) => p.id === Number(productoId));
  const variantesDelProducto = variantes.filter(
    (v) => v.productoId === Number(productoId)
  );

  const nombreTalla = (id) => tallas.find((t) => t.id === id)?.nombre ?? "—";
  const colorInfo = (id) => colores.find((c) => c.id === id);

  function cambiarCategoria(nuevaCategoriaId) {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoActual.id
          ? { ...p, categoriaId: Number(nuevaCategoriaId) }
          : p
      )
    );
    onCambiarCategoria?.(productoActual.id, Number(nuevaCategoriaId));
  }

  function asociarVariante(e) {
    e.preventDefault();
    setExito("");

    const pId = productoActual.id;
    const tId = Number(tallaId);
    const cId = Number(colorId);

    const yaExiste = variantes.some(
      (v) => v.productoId === pId && v.tallaId === tId && v.colorId === cId
    );

    if (yaExiste) {
      setError(
        "Este producto ya tiene esa combinación de talla y color asociada."
      );
      return;
    }

    const nuevaVariante = {
      id: genId(),
      productoId: pId,
      tallaId: tId,
      colorId: cId,
      stock: 0,
    };

    setVariantes((prev) => [...prev, nuevaVariante]);
    onCrearVariante?.(nuevaVariante);
    setError("");
    setExito("Variante asociada al producto.");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Asociaciones de producto
      </h2>
      <p className="text-slate-500 mb-6">
        Vincula un producto a su categoría y a sus variantes disponibles.
      </p>

      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Producto
        </label>
        <select
          value={productoId}
          onChange={(e) => {
            setProductoId(e.target.value);
            setError("");
            setExito("");
          }}
          className="w-full md:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {productoActual && (
        <>
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Categoría asociada
            </label>
            <select
              value={productoActual.categoriaId ?? ""}
              onChange={(e) => cambiarCategoria(e.target.value)}
              className="w-full md:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Variantes de {productoActual.nombre}
            </h3>

            <form
              onSubmit={asociarVariante}
              className="flex flex-wrap gap-2 mb-4"
            >
              <select
                value={tallaId}
                onChange={(e) => setTallaId(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {tallas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              <select
                value={colorId}
                onChange={(e) => setColorId(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {colores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Asociar variante
              </button>
            </form>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}
            {exito && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
                {exito}
              </p>
            )}

            <div className="space-y-2">
              {variantesDelProducto.length === 0 && (
                <p className="text-slate-400 text-sm italic">
                  Este producto no tiene variantes asociadas todavía.
                </p>
              )}
              {variantesDelProducto.map((v) => {
                const color = colorInfo(v.colorId);
                return (
                  <div
                    key={v.id}
                    className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: color?.hex }}
                      />
                      Talla {nombreTalla(v.tallaId)} · {color?.nombre}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Stock: {v.stock}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
