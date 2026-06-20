import { useState } from "react";

const MOCK_USERS = [
  { id: 1, name: "Ana García", email: "ana@empresa.com", role: "admin" },
  { id: 2, name: "Carlos López", email: "carlos@empresa.com", role: "editor" },
  { id: 3, name: "María Torres", email: "maria@empresa.com", role: "viewer" },
];

export default function EditUser() {
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSelect = (e) => {
    const user = MOCK_USERS.find((u) => u.id === Number(e.target.value));
    if (user) {
      setSelectedId(user.id);
      setForm({ name: user.name, email: user.email, role: user.role });
      setErrors({});
      setSuccess(false);
    } else {
      setSelectedId("");
      setForm({ name: "", email: "", role: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Ingresa un correo válido.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-amber-500 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Modificar Usuario</h1>
          <p className="text-amber-100 text-sm mt-1">Selecciona un usuario y edita sus datos.</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
              ✓ Usuario actualizado correctamente.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar usuario</label>
            <select
              value={selectedId}
              onChange={handleSelect}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition bg-white"
            >
              <option value="">— Elige un usuario —</option>
              {MOCK_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {selectedId && (
            <form onSubmit={handleSubmit} className="space-y-5 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.name ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.email ? "border-red-400 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition bg-white"
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Guardar cambios
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
