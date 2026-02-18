'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/types';
import { ChevronRight, Star, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [destacados, setDestacados] = useState<Producto[]>([]);

  useEffect(() => {
    // Traemos solo 4 productos para la sección de destacados
    const fetchDestacados = async () => {
      const { data } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .limit(4);
      if (data) setDestacados(data as Producto[]);
    };
    fetchDestacados();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- SECCIÓN HERO (BANNER PRINCIPAL) --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo con Overlay oscuro */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?q=80&w=2000')`, // Puedes cambiar esta URL por una de tus fotos de impresión 3D
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/60" />
        </div>

        {/* Contenido del Banner */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-blue-600 rounded-full animate-bounce">
            Novedad: Templos en Alta Definición
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
            Impresiones 3D con <br /> <span className="text-blue-400">Significado Eterno</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-slate-200 max-w-2xl mx-auto font-light">
            Lleva a tu hogar réplicas detalladas y arte inspirado en los valores de la Iglesia de Jesucristo. Calidad premium en cada detalle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalogo" 
              className="px-10 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              Ir a la Tienda <ChevronRight size={20} />
            </Link>
            <Link 
              href="/nosotros" 
              className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Conócenos
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE VALORES (ICONOS) --- */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-800"><ShieldCheck size={32} /></div>
            <div>
              <h3 className="font-bold">Calidad Premium</h3>
              <p className="text-sm text-slate-500">Materiales duraderos y finas terminaciones.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-800"><Truck size={32} /></div>
            <div>
              <h3 className="font-bold">Envíos Seguros</h3>
              <p className="text-sm text-slate-500">Protegemos tu pedido hasta la puerta.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-800"><Star size={32} /></div>
            <div>
              <h3 className="font-bold">Diseños Únicos</h3>
              <p className="text-sm text-slate-500">Modelos exclusivos de Moriancumer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS --- */}
      <section className="py-20 max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Productos Destacados</h2>
            <p className="text-slate-500">Las piezas más queridas por nuestra comunidad.</p>
          </div>
          <Link href="/catalogo" className="text-blue-700 font-bold flex items-center gap-1 hover:underline">
            Ver todo <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destacados.map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="relative h-64 bg-slate-100 rounded-3xl mb-4 overflow-hidden shadow-sm">
                <img 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${p.imagen_url}`}
                  alt={p.nombre}
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-slate-800">{p.nombre}</h3>
              <p className="text-blue-700 font-black text-lg">${p.precio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">M</div>
              <span className="text-xl font-black tracking-tighter">MORIANCUMER</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dedicados a fortalecer la fe a través del arte y la tecnología de impresión 3D.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">Navegación</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition">Catálogo</Link></li>
              <li><Link href="/nosotros" className="hover:text-white transition">Nosotros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">Legal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link href="#" className="hover:text-white transition">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition">Envíos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">Suscríbete</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Tu email" className="bg-slate-800 border-none rounded-xl px-4 py-2 w-full text-sm" />
              <button className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © 2026 Moriancumer 3D. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}