// ProductosManager.jsx
// -----------------------------------------------------------------------------
// 1. MODIFICAR Y ELIMINAR PRODUCTOS
// -----------------------------------------------------------------------------
// Lista los productos existentes y permite:
//   - Editar nombre, descripción, precio y categoría
//   - Eliminar un producto (con confirmación)
//
// Props:
//   productos:        array de productos [{ id, nombre, descripcion, precio, categoriaId, fotos }]
//   categorias:       array de categorías [{ id, nombre }] (para el selector)
//   onActualizar(id, datosActualizados): callback al guardar cambios
//   onEliminar(id):   callback al confirmar eliminación
//
// Si no se pasan props, el componente funciona de forma autónoma con datos
// de ejemplo (útil para probarlo aislado).
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { initialProductos, initialCategorias } from "./store";

function formatCOP(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function ProductosManager({
  productos: productosProp,
  categorias: categoriasProp,
  onActualizar,
  onEliminar,
}) {
  const [productos, setProductos] = useState(productosProp ?? initialProductos);
  const categorias = categoriasProp ?? initialCategorias;

  const [editandoId, setEditandoId] = useState(null);
  const [borrador, setBorrador] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const nombreCategoria = (categoriaId) =>
    categorias.find((c) => c.id === categoriaId)?.nombre ?? "Sin categoría";

  function iniciarEdicion(producto) {
    setEditandoId(producto.id);
    setBorrador({ ...producto });
    setMensaje("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setBorrador(null);
  }

  function guardarEdicion() {
    if (!borrador.nombre.trim()) {
      setMensaje("El nombre no puede estar vacío.");
      return;
    }
    if (Number(borrador.precio) < 0) {
      setMensaje("El precio no puede ser negativo.");
      return;
    }

    const actualizado = {
      ...borrador,
      precio: Number(borrador.precio),
      categoriaId: Number(borrador.categoriaId),
    };

    setProductos((prev) =>
      prev.map((p) => (p.id === actualizado.id ? actualizado : p))
    );
    onActualizar?.(actualizado.id, actualizado);

    setEditandoId(null);
    setBorrador(null);
    setMensaje("Producto actualizado correctamente.");
  }

  function eliminarProducto(id) {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    onEliminar?.(id);
    setConfirmandoId(null);
    setMensaje("Producto eliminado.");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Gestión de productos
      </h2>
      <p className="text-slate-500 mb-6">
        Modifica los datos de un producto o elimínalo del catálogo.
      </p>

      {mensaje && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
          {mensaje}
        </div>
      )}

      <div className="space-y-3">
        {productos.length === 0 && (
          <p className="text-slate-400 text-sm italic">
            No hay productos registrados.
          </p>
        )}

        {productos.map((producto) => {
          const enEdicion = editandoId === producto.id;

          return (
            <div
              key={producto.id}
              className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
            >
              {!enEdicion ? (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {producto.descripcion}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium text-indigo-600">
                        {formatCOP(producto.precio)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {nombreCategoria(producto.categoriaId)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => iniciarEdicion(producto)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Editar
                    </button>

                    {confirmandoId === producto.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmandoId(null)}
                          className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmandoId(producto.id)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={borrador.nombre}
                      onChange={(e) =>
                        setBorrador({ ...borrador, nombre: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={borrador.descripcion}
                      onChange={(e) =>
                        setBorrador({
                          ...borrador,
                          descripcion: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Precio (COP)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={borrador.precio}
                      onChange={(e) =>
                        setBorrador({ ...borrador, precio: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Categoría
                    </label>
                    <select
                      value={borrador.categoriaId}
                      onChange={(e) =>
                        setBorrador({
                          ...borrador,
                          categoriaId: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 flex gap-2 justify-end mt-1">
                    <button
                      onClick={cancelarEdicion}
                      className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={guardarEdicion}
                      className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
