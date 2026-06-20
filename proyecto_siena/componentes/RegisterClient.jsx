import { useState } from "react";

export default function RegisterClient() {
  const [form, setForm] = useState({
    fullName: "",
    docType: "CC",
    docNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "El nombre es obligatorio.";
    if (!form.docNumber.trim()) newErrors.docNumber = "El número de documento es obligatorio.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Ingresa un correo válido.";
    if (!form.phone.match(/^\d{7,15}$/))
      newErrors.phone = "Ingresa un teléfono válido.";
    if (!form.city.trim()) newErrors.city = "La ciudad es obligatoria.";
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
    setSuccess(true);
    setForm({ fullName: "", docType: "CC", docNumber: "", email: "", phone: "", address: "", city: "" });
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
          errors[name] ? "border-red-400 bg-red-50" : "border-slate-300"
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-teal-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Registrar Cliente</h1>
          <p className="text-teal-100 text-sm mt-1">Completa los datos del nuevo cliente.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
              ✓ Cliente registrado correctamente.
            </div>
          )}

          <Field label="Nombre completo" name="fullName" placeholder="Juan Pérez" />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo doc.</label>
              <select
                name="docType"
                value={form.docType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white"
              >
                <option>CC</option>
                <option>NIT</option>
                <option>CE</option>
                <option>Pasaporte</option>
              </select>
            </div>
            <div className="col-span-2">
              <Field label="Número de documento" name="docNumber" placeholder="1234567890" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Correo electrónico" name="email" type="email" placeholder="juan@correo.com" />
            <Field label="Teléfono" name="phone" placeholder="3001234567" />
          </div>

          <Field label="Dirección" name="address" placeholder="Calle 45 # 23-10" />
          <Field label="Ciudad" name="city" placeholder="Bogotá" />

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Registrar cliente
          </button>
        </form>
      </div>
    </div>
  );
}
