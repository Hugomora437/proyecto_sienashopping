# Componentes React — Gestión de inventario y ventas

8 componentes en archivos separados (.jsx), con Tailwind CSS, listos para
integrar en un proyecto React (Vite, Create React App, Next.js, etc).

## Archivos

| Archivo | Funcionalidad |
|---|---|
| `store.js` | Datos de ejemplo compartidos ("base de datos" en memoria) |
| `ProductosManager.jsx` | 1. Modificar y eliminar productos |
| `ProductoFotos.jsx` | 2. Asociar fotos a productos |
| `VariantesManager.jsx` | 3. Crear variantes evitando duplicados |
| `StockManager.jsx` | 4. Modificar stock y consultar disponibilidad |
| `AtributosManager.jsx` | 5. CRUD de categorías, tallas y colores |
| `ProductoAsociaciones.jsx` | 6. Asociar productos a categorías y variantes |
| `VentaRegistro.jsx` | 7. Registrar ventas |
| `DetalleVentaManager.jsx` | 8. Registrar/consultar detalle de venta |
| `App.jsx` | Ejemplo de integración con pestañas (opcional) |

## Instalación

1. Crea un proyecto React si no tienes uno:
   ```bash
   npm create vite@latest mi-app -- --template react
   cd mi-app
   ```

2. Instala y configura Tailwind CSS (si no lo tienes ya):
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
   En `vite.config.js` agrega el plugin de Tailwind, y en tu CSS principal
   (`src/index.css`) agrega:
   ```css
   @import "tailwindcss";
   ```

3. Copia todos los archivos `.jsx` y `store.js` dentro de `src/` (por ejemplo
   en `src/components/`).

4. Importa el componente que necesites donde quieras usarlo:
   ```jsx
   import ProductosManager from "./components/ProductosManager";

   function MiPagina() {
     return <ProductosManager />;
   }
   ```

   O usa `App.jsx` como ejemplo para verlos todos juntos con pestañas.

## Cómo conectarlos a una base de datos real (SQL Server / MySQL)

Cada componente funciona de forma autónoma con datos de `store.js` si no le
pasas props. Para conectarlo a tu API:

1. Crea tus endpoints en el backend (ej. `GET /productos`, `PUT /productos/:id`,
   `DELETE /productos/:id`, etc).
2. En el componente padre (como `App.jsx`), haz `fetch` a tu API con
   `useEffect`, guarda el resultado en estado, y pásalo como prop:
   ```jsx
   const [productos, setProductos] = useState([]);

   useEffect(() => {
     fetch("/api/productos")
       .then((res) => res.json())
       .then(setProductos);
   }, []);

   <ProductosManager
     productos={productos}
     onActualizar={(id, datos) =>
       fetch(`/api/productos/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(datos),
       })
     }
     onEliminar={(id) =>
       fetch(`/api/productos/${id}`, { method: "DELETE" })
     }
   />
   ```
3. Repite el patrón para cada componente: todos aceptan los datos por props
   y notifican los cambios mediante callbacks (`onActualizar`, `onEliminar`,
   `onCrearVariante`, `onRegistrarVenta`, etc.), documentados al inicio de
   cada archivo.

## Notas

- Las validaciones de "evitar duplicados" en variantes comparan
  `productoId + tallaId + colorId` tanto en `VariantesManager.jsx` como en
  `ProductoAsociaciones.jsx`.
- `ProductoFotos.jsx` usa `URL.createObjectURL` para previsualizar imágenes
  localmente; en producción deberías subir el archivo a tu servidor y guardar
  la URL que te devuelva.
- Los montos usan formato de pesos colombianos (COP). Cámbialo en las
  funciones `formatCOP` si necesitas otra moneda.
