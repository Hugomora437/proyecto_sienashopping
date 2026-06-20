// App.jsx
// -----------------------------------------------------------------------------
// EJEMPLO DE INTEGRACIÓN
// -----------------------------------------------------------------------------
// Este archivo NO es uno de los 8 componentes solicitados: es un ejemplo de
// cómo montarlos juntos en una sola app con pestañas, para verlos funcionar
// en conjunto. Puedes usarlo como punto de partida o ignorarlo si vas a
// integrar los componentes en tu propio proyecto.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import ProductosManager from "./ProductosManager";
import ProductoFotos from "./ProductoFotos";
import VariantesManager from "./VariantesManager";
import StockManager from "./StockManager";
import AtributosManager from "./AtributosManager";
import ProductoAsociaciones from "./ProductoAsociaciones";
import VentaRegistro from "./VentaRegistro";
import DetalleVentaManager from "./DetalleVentaManager";

const SECCIONES = [
  { key: "productos", label: "Productos", Componente: ProductosManager },
  { key: "fotos", label: "Fotos", Componente: ProductoFotos },
  { key: "variantes", label: "Variantes", Componente: VariantesManager },
  { key: "stock", label: "Stock", Componente: StockManager },
  { key: "atributos", label: "Categorías/Tallas/Colores", Componente: AtributosManager },
  { key: "asociaciones", label: "Asociaciones", Componente: ProductoAsociaciones },
  { key: "ventas", label: "Ventas", Componente: VentaRegistro },
  { key: "detalle", label: "Detalle de venta", Componente: DetalleVentaManager },
];

export default function App() {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES[0].key);

  const ComponenteActivo = SECCIONES.find(
    (s) => s.key === seccionActiva
  ).Componente;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 overflow-x-auto">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {SECCIONES.map((s) => (
            <button
              key={s.key}
              onClick={() => setSeccionActiva(s.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                seccionActiva === s.key
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <ComponenteActivo />
    </div>
  );
}
