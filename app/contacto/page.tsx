'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: 'Cotización Personalizada',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías integrar un servicio de email o guardar en Supabase
    console.log("Datos enviados:", form);
    setEnviado(true);
    
    // Resetear formulario después de 5 segundos
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-blue-900 mb-4 uppercase tracking-tighter">Contacto</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          ¿Tienes un proyecto especial en mente o necesitas una figura personalizada? 
          Estamos aquí para ayudarte a traer tus ideas al mundo físico con impresión 3D.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Información de contacto */}
        <div className="space-y-8">
          <div className="bg-blue-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <h2 className="text-2xl font-bold mb-6">Información de Moriancumer</h2>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-blue-800 p-3 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-blue-200 text-xs uppercase font-bold tracking-widest">Email</p>
                  <p className="font-medium text-lg">hola@moriancumer3d.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-800 p-3 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-blue-200 text-xs uppercase font-bold tracking-widest">WhatsApp</p>
                  <p className="font-medium text-lg">+54 9 11 1234-5678</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-800 p-3 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-blue-200 text-xs uppercase font-bold tracking-widest">Ubicación</p>
                  <p className="font-medium text-lg">Envíos a todo el país</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50">
            <h3 className="font-bold text-slate-800 mb-2">Horarios de atención</h3>
            <p className="text-slate-600 text-sm">Lunes a Viernes: 09:00 - 18:00</p>
            <p className="text-slate-600 text-sm">Sábados: 10:00 - 14:00</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl">
          {enviado ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in">
              <CheckCircle2 size={80} className="text-green-500" />
              <h2 className="text-2xl font-bold text-slate-800">¡Mensaje Enviado!</h2>
              <p className="text-slate-500">Nos comunicaremos contigo a la brevedad posible.</p>
              <button 
                onClick={() => setEnviado(false)}
                className="text-blue-700 font-bold hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nombre</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Tu nombre"
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={form.nombre}
                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="correo@ejemplo.com"
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Categoría de Interés</label>
                <select 
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none appearance-none bg-white"
                  value={form.asunto}
                  onChange={(e) => setForm({...form, asunto: e.target.value})}
                >
                  <option>Cotización Personalizada</option>
                  <option>Consulta sobre Pedido</option>
                  <option>Ventas por Mayor</option>
                  <option>Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mensaje</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Cuéntanos qué figura o pieza necesitas..."
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                  value={form.mensaje}
                  onChange={(e) => setForm({...form, mensaje: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <Send size={18} /> Enviar Mensaje
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}