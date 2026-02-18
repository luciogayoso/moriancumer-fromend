import { BookOpen, Lightbulb, Users } from 'lucide-react';

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Nosotros */}
      <section className="bg-blue-900 py-24 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-6 italic">"Moriancumer"</h1>
          <p className="text-xl text-blue-100 font-light leading-relaxed">
            Un nombre que representa la fe inquebrantable y la búsqueda de luz en medio de la oscuridad.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Nuestra Misión</h2>
          <p className="text-slate-600 mb-6 text-lg leading-relaxed">
            Inspirados por la historia del Hermano de Jared, quien llevó piedras transparentes al Señor para que las iluminara, en **Moriancumer 3D** tomamos polímeros y tecnología para crear objetos que iluminen tu hogar.
          </p>
          <p className="text-slate-600 text-lg leading-relaxed">
            Nos especializamos en figuras, templos y artículos que recuerden los convenios y la belleza del evangelio, utilizando la mayor precisión que la impresión 3D actual permite.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 h-64 rounded-3xl flex items-center justify-center p-8 text-center flex-col gap-3">
             <Lightbulb className="text-blue-600" size={40} />
             <span className="font-bold text-slate-800 italic text-sm">Innovación Espiritual</span>
          </div>
          <div className="bg-blue-50 h-64 rounded-3xl translate-y-8 flex items-center justify-center p-8 text-center flex-col gap-3">
             <Users className="text-blue-600" size={40} />
             <span className="font-bold text-slate-800 italic text-sm">Comunidad Unida</span>
          </div>
        </div>
      </section>
    </div>
  );
}