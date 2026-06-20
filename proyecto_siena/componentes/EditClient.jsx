import { useState } from "react";

const MOCK_CLIENTS = [
  { id: 1, fullName: "Juan Pérez", docType: "CC", docNumber: "1234567890", email: "juan@correo.com", phone: "3001234567", address: "Calle 45 # 23-10", city: "Bogotá" },
  { id: 2, fullName: "Laura Méndez", docType: "NIT", docNumber: "9005678901", email: "laura@empresa.com", phone: "3107654321", address: "Carrera 10 # 5-20", city: "Medellín" },
];

export default function EditClient() {
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSelect = (e) => {
    const client = MOCK_CLIENTS.find((c) => c.id === Number(e.target.value));
    if (client) {
      setSelectedId(client.id);
      setForm({ ...client });
    } else {
      setSelectedId("");
      setForm({});
    }
    setErrors({});
    setSuccess(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName?.trim()) newErrors.fullName = "El nombre es obligatorio.";
    if (!form.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Correo inválido.";
    if (!form.phone?.match(/^\d{7,15}$/)) newErrors.phone = "Teléfono inválido.";
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

  const Field = ({ label, name, type = "text" }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={form[name] || ""}
        onChange={handleChange}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
          errors[name] ? "border-red-400 bg-red-50" : "border-slate-300"
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-violet-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Modificar Cliente</h1>
          <p className="text-violet-200 text-sm mt-1">Actualiza los datos de un cliente existente.</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
              ✓ Datos del cliente actualizados.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar cliente</label>
            <select
              value={selectedId}
              onChange={handleSelect}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition bg-white"
            >
              <option value="">— Elige un cliente —</option>
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>

          {selectedId && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
              <Field label="Nombre completo" name="fullName" />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Correo electrónico" name="email" type="email" />
                <Field label="Teléfono" name="phone" />
              </div>

              <Field label="Dirección" name="address" />
              <Field label="Ciudad" name="city" />

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
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
