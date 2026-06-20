// store.js
// -----------------------------------------------------------------------------
// "Base de datos" en memoria compartida por todos los componentes.
// Esto simula lo que normalmente vendría de una API (SQL Server / MySQL).
// Cuando conectes un backend real, solo tienes que reemplazar las funciones
// de este archivo por llamadas fetch()/axios a tus endpoints, sin tocar
// los componentes que las usan.
// -----------------------------------------------------------------------------

// ---- Generador simple de IDs ----
let nextId = 1000;
export const genId = () => nextId++;

// ---- Datos iniciales de ejemplo ----

export const initialCategorias = [
  { id: 1, nombre: "Camisetas" },
  { id: 2, nombre: "Pantalones" },
  { id: 3, nombre: "Chaquetas" },
];

export const initialTallas = [
  { id: 1, nombre: "S" },
  { id: 2, nombre: "M" },
  { id: 3, nombre: "L" },
  { id: 4, nombre: "XL" },
];

export const initialColores = [
  { id: 1, nombre: "Rojo", hex: "#ef4444" },
  { id: 2, nombre: "Azul", hex: "#3b82f6" },
  { id: 3, nombre: "Negro", hex: "#1f2937" },
];

export const initialProductos = [
  {
    id: 1,
    nombre: "Camiseta Básica",
    descripcion: "Camiseta de algodón 100%",
    precio: 35000,
    categoriaId: 1,
    fotos: [],
  },
  {
    id: 2,
    nombre: "Pantalón Cargo",
    descripcion: "Pantalón resistente con bolsillos laterales",
    precio: 89000,
    categoriaId: 2,
    fotos: [],
  },
];

// Variantes = combinación única de producto + talla + color, con su propio stock
export const initialVariantes = [
  { id: 1, productoId: 1, tallaId: 2, colorId: 3, stock: 20 },
  { id: 2, productoId: 1, tallaId: 3, colorId: 1, stock: 15 },
  { id: 3, productoId: 2, tallaId: 2, colorId: 2, stock: 10 },
];

export const initialVentas = [];
export const initialDetalleVentas = [];

// ---- Claves de localStorage (opcional, no se usa por defecto) ----
export const STORAGE_KEY = "inventario_demo_v1";
