// AtributosManager.jsx
// -----------------------------------------------------------------------------
// 5. REGISTRAR, MODIFICAR Y ELIMINAR CATEGORÍAS, TALLAS Y COLORES
// -----------------------------------------------------------------------------
// CRUD genérico reutilizado para tres entidades simples: categorías, tallas
// y colores. Se navega entre las tres con pestañas.
//
// Props:
//   categorias: [{ id, nombre }]
//   tallas:     [{ id, nombre }]
//   colores:    [{ id, nombre, hex }]
//   onCambiosCategorias(nuevasCategorias)
//   onCambiosTallas(nuevasTallas)
//   onCambiosColores(nuevosColores)
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import {
  initialCategorias,
  initialTallas,
  initialColores,
  genId,
} from "./store";

const TABS = [
  { key: "categorias", label: "Categorías" },
  { key: "tallas", label: "Tallas" },
  { key: "colores", label: "Colores" },
];

// CRUD genérico de una lista de { id, nombre } (colores además tiene "hex")
function ListaCRUD({ tipo, items, setItems, onCambios }) {
  const [nombre, setNombre] = useState("");
  const [hex, setHex] = useState("#6366f1");
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEdicion, setNombreEdicion] = useState("");
  const [hexEdicion, setHexEdicion] = useState("#000000");
  const [error, setError] = useState("");

  const esColor = tipo === "colores";

  function existeNombre(valor, ignorarId = null) {
    return items.some(
      (i) =>
        i.id !== ignorarId &&
        i.nombre.trim().toLowerCase() === valor.trim().toLowerCase()
    );
  }

  function agregar(e) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (existeNombre(nombre)) {
      setError(`Ya existe "${nombre}" en esta lista.`);
      return;
    }

    const nuevo = esColor
      ? { id: genId(), nombre: nombre.trim(), hex }
      : { id: genId(), nombre: nombre.trim() };

    const actualizados = [...items, nuevo];
    setItems(actualizados);
    onCambios?.(actualizados);
    setNombre("");
    setHex("#6366f1");
    setError("");
  }

  function iniciarEdicion(item) {
    setEditandoId(item.id);
    setNombreEdicion(item.nombre);
    setHexEdicion(item.hex ?? "#000000");
    setError("");
  }

  function guardarEdicion(id) {
    if (!nombreEdicion.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (existeNombre(nombreEdicion, id)) {
      setError(`Ya existe "${nombreEdicion}" en esta lista.`);
      return;
    }

    const actualizados = items.map((i) =>
      i.id === id
        ? {
            ...i,
            nombre: nombreEdicion.trim(),
            ...(esColor ? { hex: hexEdicion } : {}),
          }
        : i
    );
    setItems(actualizados);
    onCambios?.(actualizados);
    setEditandoId(null);
    setError("");
  }

  function eliminar(id) {
    const actualizados = items.filter((i) => i.id !== id);
    setItems(actualizados);
    onCambios?.(actualizados);
  }

  return (
    <div>
      <form onSubmit={agregar} className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder={`Nuevo nombre...`}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 min-w-[160px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {esColor && (
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer"
            title="Color"
          />
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Agregar
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-slate-400 text-sm italic">
            No hay elementos registrados.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2.5"
          >
            {editandoId === item.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={nombreEdicion}
                  onChange={(e) => setNombreEdicion(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {esColor && (
                  <input
                    type="color"
                    value={hexEdicion}
                    onChange={(e) => setHexEdicion(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer"
                  />
                )}
                <button
                  onClick={() => guardarEdicion(item.id)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoId(null)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <span className="flex items-center gap-2 text-sm text-slate-700">
                  {esColor && (
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: item.hex }}
                    />
                  )}
                  {item.nombre}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => iniciarEdicion(item)}
                    className="px-3 py-1 text-xs rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(item.id)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AtributosManager({
  categorias: categoriasProp,
  tallas: tallasProp,
  colores: coloresProp,
  onCambiosCategorias,
  onCambiosTallas,
  onCambiosColores,
}) {
  const [tab, setTab] = useState("categorias");

  const [categorias, setCategorias] = useState(
    categoriasProp ?? initialCategorias
  );
  const [tallas, setTallas] = useState(tallasProp ?? initialTallas);
  const [colores, setColores] = useState(coloresProp ?? initialColores);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Categorías, tallas y colores
      </h2>
      <p className="text-slate-500 mb-6">
        Administra los atributos base que se usan para crear variantes.
      </p>

      <div className="flex gap-1 mb-5 bg-slate-100 rounded-lg p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
              tab === t.key
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "categorias" && (
        <ListaCRUD
          tipo="categorias"
          items={categorias}
          setItems={setCategorias}
          onCambios={onCambiosCategorias}
        />
      )}
      {tab === "tallas" && (
        <ListaCRUD
          tipo="tallas"
          items={tallas}
          setItems={setTallas}
          onCambios={onCambiosTallas}
        />
      )}
      {tab === "colores" && (
        <ListaCRUD
          tipo="colores"
          items={colores}
          setItems={setColores}
          onCambios={onCambiosColores}
        />
      )}
    </div>
  );
}
