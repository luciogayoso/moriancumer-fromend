'use client'; // Paso 1: Agregar 'use client' para poder usar el Hook del carrito
import "./globals.css";
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { CarritoProvider, useCarrito } from '@/context/CarritoContext';

// Creamos un componente pequeño para el Navbar que pueda usar el contexto
function Navbar() {
  const { totalItems } = useCarrito(); // Paso 2: Obtener la cantidad real de items

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:shadow-md transition-all">
            <img 
              src="/logo.svg" 
              alt="Moriancumer Logo" 
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-blue-900 leading-none">
              MORIANCUMER
            </span>
            <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">
              Impresiones 3D
            </span>
          </div>
        </Link>

        {/* ENLACES CENTRALES */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-slate-600">
          <Link href="/" className="hover:text-blue-900 transition-colors">Inicio</Link>
          <Link href="/catalogo" className="hover:text-blue-900 transition-colors">Catálogo</Link>
          <Link href="/nosotros" className="hover:text-blue-900 transition-colors">Nosotros</Link>
          <Link href="/contacto" className="hover:text-blue-900 transition-colors">Contacto</Link>
        </div>

        {/* CARRITO / MENU MOVIL */}
        <div className="flex items-center gap-4">
          {/* Cambiamos el link a /carrito y usamos totalItems */}
          <Link href="/carrito" className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        <CarritoProvider>
          <Navbar /> {/* Renderizamos el Navbar que consume el contexto */}
          <div className="pt-20">
            {children}
          </div>
        </CarritoProvider>
      </body>
    </html>
  );
}