import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import FormPrestamo from "./components/FormPrestamo";
import ListaPrestamos from "./components/ListaPrestamos";

function diasDesdeISO(fechaISO) {
  if (!fechaISO) return 0;
  const f = new Date(fechaISO + "T00:00:00");
  const hoy = new Date();
  return Math.floor((hoy - f) / (1000 * 60 * 60 * 24));
}

export default function App() {
  const [prestamos, setPrestamos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const cargarPrestamos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prestamos")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error(error);
    setPrestamos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const vencidos = useMemo(() => (
    prestamos.filter(p => p.estado === "Prestado" && diasDesdeISO(p.fecha_prestamo) > 7)
  ), [prestamos]);

  useEffect(() => {
    if (vencidos.length > 0) setShowReminder(true);
  }, [vencidos.length]);

  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    if (!q) return prestamos;
    return prestamos.filter(p =>
      p.material.toLowerCase().includes(q) ||
      (p.especificaciones || '').toLowerCase().includes(q) ||
      p.prestado_a.toLowerCase().includes(q) ||
      (p.ot || '').toLowerCase().includes(q)
    );
  }, [prestamos, buscar]);

  const onSave = async (form) => {
    setSaving(true);
    const { data, error } = await supabase.from("prestamos").insert([form]).select("*");
    setSaving(false);
    if (error) {
      console.error(error);
      alert("Error al guardar. Revisa la consola.");
      return;
    }
    setPrestamos(prev => [data[0], ...prev]);
    setMostrarForm(false);
  };

  const onMarcarDevuelto = async (p) => {
    const hoy = new Date().toISOString().slice(0,10);
    const { data, error } = await supabase
      .from("prestamos")
      .update({ estado: "Devuelto", fecha_devolucion: hoy })
      .eq("id", p.id)
      .select("*");
    if (error) {
      console.error(error);
      alert("No se pudo actualizar.");
      return;
    }
    setPrestamos(prev => prev.map(x => x.id === p.id ? data[0] : x));
  };

  const onBorrar = async (p) => {
    if (!confirm("¿Borrar este préstamo?")) return;
    const { error } = await supabase.from("prestamos").delete().eq("id", p.id);
    if (error) {
      console.error(error);
      alert("No se pudo borrar.");
      return;
    }
    setPrestamos(prev => prev.filter(x => x.id !== p.id));
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <header className="fixed top-0 inset-x-0 z-50 bg-rose-50/80 backdrop-blur border-b border-rose-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <img src="/logo.png" alt="Dual Talleres" className="h-7 w-auto" />
          <span className="text-rose-800 font-medium">Dual Talleres</span>

          <input
            className="ml-4 flex-1 rounded-lg border border-rose-200 bg-white/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="Buscar por material, especificaciones, persona u O.T...."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />

          <button
            className="ml-3 rounded-lg bg-rose-500 px-3 py-1.5 text-white text-sm hover:bg-rose-600"
            onClick={() => setMostrarForm(true)}
          >
            Agregar préstamo
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="rounded-lg border border-rose-200 p-3">
            <p className="text-xs text-rose-700/80">Total</p>
            <p className="text-lg text-rose-800">{prestamos.length}</p>
          </div>
          <div className="rounded-lg border border-rose-200 p-3">
            <p className="text-xs text-rose-700/80">Prestados</p>
            <p className="text-lg text-rose-800">{prestamos.filter(p=>p.estado==="Prestado").length}</p>
          </div>
          <div className="rounded-lg border border-rose-200 p-3">
            <p className="text-xs text-rose-700/80">Devueltos</p>
            <p className="text-lg text-rose-800">{prestamos.filter(p=>p.estado==="Devuelto").length}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-rose-700">Cargando…</div>
        ) : (
          <ListaPrestamos prestamos={filtrados} onMarcarDevuelto={onMarcarDevuelto} onBorrar={onBorrar} />
        )}
      </main>

      {mostrarForm && (
        <FormPrestamo onSave={onSave} onCancel={() => setMostrarForm(false)} saving={saving} />
      )}

      {showReminder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-rose-800 font-medium">Recordatorio</h2>
              <button onClick={()=>setShowReminder(false)} className="text-sm border rounded px-2 py-1 border-rose-300 hover:bg-rose-50">Cerrar</button>
            </div>
            <p className="mt-2 text-sm text-rose-900">Hay {vencidos.length} préstamo(s) con más de 7 días sin devolverse:</p>
            <ul className="mt-2 text-sm list-disc pl-5">
              {vencidos.map(v => (
                <li key={v.id}>
                  {v.material} — O.T.: {v.ot} — {v.prestado_a} (desde {v.fecha_prestamo})
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-end">
              <button onClick={()=>setShowReminder(false)} className="rounded px-3 py-1 bg-rose-500 text-white hover:bg-rose-600">Entendido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
