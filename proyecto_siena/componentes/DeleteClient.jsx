import { useState } from "react";

const INITIAL_CLIENTS = [
  { id: 1, fullName: "Juan Pérez", email: "juan@correo.com", city: "Bogotá", activeSales: 3 },
  { id: 2, fullName: "Laura Méndez", email: "laura@empresa.com", city: "Medellín", activeSales: 0 },
  { id: 3, fullName: "Pedro Ruiz", email: "pedro@correo.com", city: "Cali", activeSales: 0 },
  { id: 4, fullName: "Sofía Castro", email: "sofia@empresa.com", city: "Cartagena", activeSales: 1 },
];

export default function DeleteClient() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [selected, setSelected] = useState(null);
  const [deleted, setDeleted] = useState(null);

  const eligible = clients.filter((c) => c.activeSales === 0);
  const blocked = clients.filter((c) => c.activeSales > 0);

  const handleDelete = () => {
    setDeleted(selected.fullName);
    setClients(clients.filter((c) => c.id !== selected.id));
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-rose-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Eliminar Cliente</h1>
          <p className="text-rose-200 text-sm mt-1">Solo se pueden eliminar clientes sin ventas activas.</p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {deleted && (
            <div className="bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-4 py-3 text-sm">
              El cliente <strong>{deleted}</strong> fue eliminado correctamente.
            </div>
          )}

          {eligible.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Disponibles para eliminar
              </p>
              <ul className="space-y-2">
                {eligible.map((client) => (
                  <li
                    key={client.id}
                    onClick={() => { setSelected(client); setDeleted(null); }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border cursor-pointer transition ${
                      selected?.id === client.id
                        ? "border-rose-400 bg-rose-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{client.fullName}</p>
                      <p className="text-xs text-slate-500">{client.email} · {client.city}</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded-full">
                      Sin ventas
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blocked.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                No se pueden eliminar
              </p>
              <ul className="space-y-2">
                {blocked.map((client) => (
                  <li
                    key={client.id}
                    className="flex items-center justify-between rounded-xl px-4 py-3 border border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">{client.fullName}</p>
                      <p className="text-xs text-slate-500">{client.email} · {client.city}</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-1 rounded-full">
                      {client.activeSales} venta{client.activeSales !== 1 ? "s" : ""} activa{client.activeSales !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected && (
            <div className="border border-rose-200 bg-rose-50 rounded-xl p-4 space-y-3">
              <p className="text-sm text-rose-700">
                ¿Eliminar a <strong>{selected.fullName}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg py-2 text-sm transition"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg py-2 text-sm border border-slate-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {eligible.length === 0 && !deleted && (
            <p className="text-slate-400 text-sm text-center py-4">
              Todos los clientes tienen ventas activas y no pueden eliminarse.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
