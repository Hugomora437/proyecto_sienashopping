import { useState } from "react";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState(false);

  const CATEGORIES = ["Electrónica", "Ropa", "Alimentos", "Hogar", "Salud", "Otro"];

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.sku.trim()) newErrors.sku = "El SKU es obligatorio.";
    if (!form.category) newErrors.category = "Selecciona una categoría.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = "Ingresa un precio válido.";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)
      newErrors.stock = "Ingresa un stock válido.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setProducts([...products, { ...form, id: Date.now() }]);
    setSuccess(true);
    setForm({ name: "", sku: "", category: "", price: "", stock: "", description: "", status: "active" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-orange-500 px-8 py-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Crear Producto</h1>
            <p className="text-orange-100 text-sm mt-1">Agrega un nuevo producto al catálogo.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
                ✓ Producto creado y añadido al catálogo.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del producto</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Auriculares Bluetooth"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.name ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="ELEC-001"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.sku ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition bg-white ${
                    errors.category ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                >
                  <option value="">— Categoría —</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="59900"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.price ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="100"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.stock ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción <span className="text-slate-400 font-normal">(opcional)</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe el producto..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <div className="flex gap-4">
                {["active", "inactive"].map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={form.status === s}
                      onChange={handleChange}
                      className="accent-orange-500"
                    />
                    <span className="text-sm text-slate-700">
                      {s === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Crear producto
            </button>
          </form>
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Productos registrados ({products.length})</h2>
            <ul className="divide-y divide-slate-100">
              {products.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sku} · {p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">${Number(p.price).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Stock: {p.stock}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
