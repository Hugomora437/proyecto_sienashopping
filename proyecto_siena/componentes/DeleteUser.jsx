import { useState } from "react";

const INITIAL_USERS = [
  { id: 1, name: "Ana García", email: "ana@empresa.com", role: "Administrador" },
  { id: 2, name: "Carlos López", email: "carlos@empresa.com", role: "Editor" },
  { id: 3, name: "María Torres", email: "maria@empresa.com", role: "Visualizador" },
];

export default function DeleteUser() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selected, setSelected] = useState(null);
  const [deleted, setDeleted] = useState(null);

  const handleDelete = () => {
    setDeleted(selected.name);
    setUsers(users.filter((u) => u.id !== selected.id));
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-red-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Eliminar Usuario</h1>
          <p className="text-red-200 text-sm mt-1">Selecciona el usuario que deseas eliminar del sistema.</p>
        </div>

        <div className="px-8 py-6 space-y-4">
          {deleted && (
            <div className="bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-4 py-3 text-sm">
              El usuario <strong>{deleted}</strong> fue eliminado.
            </div>
          )}

          {users.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No hay usuarios registrados.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => { setSelected(user); setDeleted(null); }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border cursor-pointer transition ${
                    selected?.id === user.id
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email} · {user.role}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      selected?.id === user.id
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selected?.id === user.id ? "Seleccionado" : "Seleccionar"}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {selected && (
            <div className="border border-red-200 bg-red-50 rounded-xl p-4 space-y-3">
              <p className="text-sm text-red-700">
                ¿Eliminar a <strong>{selected.name}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 text-sm transition"
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
        </div>
      </div>
    </div>
  );
}
