// ProductoFotos.jsx
// -----------------------------------------------------------------------------
// 2. ASOCIAR FOTOS A PRODUCTOS
// -----------------------------------------------------------------------------
// Permite elegir un producto y asociarle una o varias fotos (galería),
// además de eliminar fotos ya asociadas.
//
// Funciona con archivos locales (input type="file") y los convierte a una
// URL temporal en el navegador (URL.createObjectURL) solo para previsualizar.
//
// Para producción: en lugar de guardar el objeto File en memoria, normalmente
// subirías la imagen a tu servidor/almacenamiento (ej. un endpoint
// "/productos/:id/fotos") y guardarías la URL que te devuelva el backend.
//
// Props:
//   productos: array de productos [{ id, nombre, fotos: [{ id, url, nombre }] }]
//   onAgregarFoto(productoId, foto):    callback al añadir una foto
//   onEliminarFoto(productoId, fotoId): callback al quitar una foto
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { initialProductos } from "./store";

let fotoIdCounter = 1;

export default function ProductoFotos({
  productos: productosProp,
  onAgregarFoto,
  onEliminarFoto,
}) {
  const [productos, setProductos] = useState(productosProp ?? initialProductos);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(
    productosProp?.[0]?.id ?? initialProductos[0]?.id ?? ""
  );
  const [error, setError] = useState("");

  const productoActual = productos.find(
    (p) => p.id === Number(productoSeleccionadoId)
  );

  function manejarSeleccionArchivos(e) {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length === 0) return;

    const archivosInvalidos = archivos.filter(
      (archivo) => !archivo.type.startsWith("image/")
    );
    if (archivosInvalidos.length > 0) {
      setError("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc).");
      return;
    }
    setError("");

    const nuevasFotos = archivos.map((archivo) => ({
      id: fotoIdCounter++,
      url: URL.createObjectURL(archivo),
      nombre: archivo.name,
    }));

    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoActual.id
          ? { ...p, fotos: [...(p.fotos ?? []), ...nuevasFotos] }
          : p
      )
    );

    nuevasFotos.forEach((foto) => onAgregarFoto?.(productoActual.id, foto));

    // Permite volver a seleccionar el mismo archivo si se repite la acción
    e.target.value = "";
  }

  function eliminarFoto(fotoId) {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoActual.id
          ? { ...p, fotos: p.fotos.filter((f) => f.id !== fotoId) }
          : p
      )
    );
    onEliminarFoto?.(productoActual.id, fotoId);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Fotos del producto
      </h2>
      <p className="text-slate-500 mb-6">
        Selecciona un producto y asocia imágenes a su galería.
      </p>

      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Producto
        </label>
        <select
          value={productoSeleccionadoId}
          onChange={(e) => setProductoSeleccionadoId(e.target.value)}
          className="w-full md:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {productoActual ? (
        <>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Agregar fotos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={manejarSeleccionArchivos}
              className="hidden"
            />
          </label>

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5">
            {(productoActual.fotos ?? []).length === 0 && (
              <p className="text-slate-400 text-sm italic col-span-full">
                Este producto aún no tiene fotos asociadas.
              </p>
            )}

            {(productoActual.fotos ?? []).map((foto) => (
              <div
                key={foto.id}
                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={foto.url}
                  alt={foto.nombre}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => eliminarFoto(foto.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  title="Eliminar foto"
                >
                  ✕
                </button>
                <p className="text-xs text-slate-500 px-2 py-1 truncate">
                  {foto.nombre}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-slate-400 text-sm italic">
          No hay productos disponibles. Crea uno primero.
        </p>
      )}
    </div>
  );
}
