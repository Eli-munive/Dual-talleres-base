import React, { useState } from 'react';

const PERSONAS = [
  "Felipe Carranza Aguilar",
  "Javier Torres Moratilla",
  "Isauro Popoca Galiote",
  "Gabriel Limon Flores",
  "Miguel Renteria Andrade",
  "Marcial Moreno Eliosa",
];

const OPCIONES_MATERIAL = ["Broca", "Cortador", "Machuelo", "Rimas"];

export default function FormPrestamo({ onSave, onCancel, saving }) {
  const hoy = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    ot: "",
    material: OPCIONES_MATERIAL[0],
    especificaciones: "",
    cantidad: 1,
    prestado_a: PERSONAS[0],
    fecha_prestamo: hoy,
    fecha_devolucion: "",
    estado: "Prestado",
  });

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.ot.trim() || !form.especificaciones.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-rose-800 font-medium">Nuevo préstamo</h2>
          <button onClick={onCancel} className="text-sm border rounded px-2 py-1 border-rose-300 hover:bg-rose-50">Cerrar</button>
        </div>

        <form onSubmit={submit} className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <label className="grid gap-1">
            <span>O.T.</span>
            <input className="border rounded px-2 py-1" value={form.ot} onChange={handle('ot')} required />
          </label>

          <label className="grid gap-1">
            <span>Material</span>
            <select className="border rounded px-2 py-1 bg-white" value={form.material} onChange={handle('material')}>
              {OPCIONES_MATERIAL.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span>Especificaciones completas</span>
            <textarea className="border rounded px-2 py-1 min-h-[80px]" value={form.especificaciones} onChange={handle('especificaciones')} placeholder="Diámetro, paso, marca, longitud, etc." required />
          </label>

          <label className="grid gap-1">
            <span>Cantidad</span>
            <input type="number" min={1} className="border rounded px-2 py-1" value={form.cantidad} onChange={handle('cantidad')} />
          </label>

          <label className="grid gap-1">
            <span>Prestado a</span>
            <select className="border rounded px-2 py-1 bg-white" value={form.prestado_a} onChange={handle('prestado_a')}>
              {PERSONAS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          <label className="grid gap-1">
            <span>Fecha de préstamo</span>
            <input type="date" className="border rounded px-2 py-1" value={form.fecha_prestamo} onChange={handle('fecha_prestamo')} />
          </label>

          <label className="grid gap-1">
            <span>Fecha de devolución</span>
            <input type="date" className="border rounded px-2 py-1" value={form.fecha_devolucion} onChange={handle('fecha_devolucion')} />
          </label>

          <label className="grid gap-1">
            <span>Estado</span>
            <select className="border rounded px-2 py-1 bg-white" value={form.estado} onChange={handle('estado')}>
              <option>Prestado</option>
              <option>Devuelto</option>
            </select>
          </label>

          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onCancel} className="border rounded px-3 py-1 border-rose-300 hover:bg-rose-50">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded px-3 py-1 bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-60">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
