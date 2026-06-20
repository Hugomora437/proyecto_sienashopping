import { useState } from "react";

export default function AuthUser() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // "success" | "error"

  const MOCK_CREDENTIALS = { email: "admin@empresa.com", password: "12345678" };

  const validate = () => {
    const newErrors = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Ingresa un correo válido.";
    if (!form.password) newErrors.password = "La contraseña es obligatoria.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (
      form.email === MOCK_CREDENTIALS.email &&
      form.password === MOCK_CREDENTIALS.password
    ) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Acceder al sistema</h1>
          <p className="text-slate-400 text-sm mt-1">Ingresa tus credenciales para continuar.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl px-8 py-8 space-y-5">
          {status === "success" && (
            <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-400 rounded-lg px-4 py-3 text-sm text-center">
              ✓ Autenticación exitosa. Bienvenido.
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-900/40 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm text-center">
              Correo o contraseña incorrectos.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@empresa.com"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white bg-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.email ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-300">Contraseña</label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white bg-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.password ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center">Demo: admin@empresa.com / 12345678</p>
        </div>
      </div>
    </div>
  );
}
