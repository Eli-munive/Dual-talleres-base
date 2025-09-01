import React from 'react';

function diasDesdeISO(fechaISO) {
  if (!fechaISO) return 0;
  const f = new Date(fechaISO + "T00:00:00");
  const hoy = new Date();
  return Math.floor((hoy - f) / (1000 * 60 * 60 * 24));
}

export default function ListaPrestamos({ prestamos, onMarcarDevuelto, onBorrar }) {
  return (
    <div className="overflow-x-auto border border-rose-200 rounded-lg bg-white/60">
      <table className="min-w-full text-sm">
        <thead className="bg-rose-100/60 text-rose-900">
          <tr>
            <th className="text-left px-3 py-2">O.T.</th>
            <th className="text-left px-3 py-2">Material</th>
            <th className="text-left px-3 py-2">Especificaciones</th>
            <th className="text-left px-3 py-2">Cant.</th>
            <th className="text-left px-3 py-2">Prestado a</th>
            <th className="text-left px-3 py-2">F. préstamo</th>
            <th className="text-left px-3 py-2">F. devolución</th>
            <th className="text-left px-3 py-2">Estado</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-200 text-rose-900/90">
          {prestamos.map((p) => {
            const vencido = p.estado === "Prestado" && diasDesdeISO(p.fecha_prestamo) > 7;
            return (
              <tr key={p.id}>
                <td className="px-3 py-2">{p.ot}</td>
                <td className="px-3 py-2">{p.material}</td>
                <td className="px-3 py-2 max-w-xs break-words">{p.especificaciones}</td>
                <td className="px-3 py-2">{p.cantidad}</td>
                <td className="px-3 py-2">{p.prestado_a}</td>
                <td className="px-3 py-2">{p.fecha_prestamo}</td>
                <td className="px-3 py-2">{p.fecha_devolucion || "-"}</td>
                <td className="px-3 py-2">
                  <span className={"text-xs px-2 py-1 rounded " + (p.estado === "Prestado" ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-800")}>
                    {p.estado}{vencido ? " • ⚠" : ""}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {p.estado === "Prestado" && (
                    <button onClick={() => onMarcarDevuelto(p)} className="mr-2 text-xs rounded border px-2 py-1 border-rose-300 hover:bg-rose-100">
                      Marcar devuelto
                    </button>
                  )}
                  <button onClick={() => onBorrar(p)} className="text-xs rounded border px-2 py-1 border-rose-300 hover:bg-rose-100">
                    Borrar
                  </button>
                </td>
              </tr>
            )
          })}
          {prestamos.length === 0 && (
            <tr><td colSpan={9} className="px-3 py-6 text-center text-rose-700">Sin préstamos.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
