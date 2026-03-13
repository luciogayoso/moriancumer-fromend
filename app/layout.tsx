'use client';

import { useState, useEffect } from 'react'; // Paso 1: Importar useState
import "./globals.css";
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react'; // Importar X para cerrar
import { CarritoProvider, useCarrito } from '@/context/CarritoContext';

function Navbar() {
  const { totalItems } = useCarrito();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); X
  }, []);

  // Función para cerrar el menú al hacer click en un enlace
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
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

        {/* ENLACES DESKTOP */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-slate-600">
          <Link href="/" className="hover:text-blue-900 transition-colors">Inicio</Link>
          <Link href="/catalogo" className="hover:text-blue-900 transition-colors">Catálogo</Link>
          <Link href="/nosotros" className="hover:text-blue-900 transition-colors">Nosotros</Link>
          <Link href="/contacto" className="hover:text-blue-900 transition-colors">Contacto</Link>
        </div>

        {/* CARRITO / BOTÓN MÓVIL */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/carrito" className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition" onClick={closeMenu}>
            <ShoppingCart size={24} />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Link>

          {/* BOTÓN HAMBURGUESA / X */}
          <button
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6 font-bold text-lg text-slate-700">
            <Link href="/" onClick={closeMenu} className="flex items-center justify-between border-b border-slate-50 pb-2">
              Inicio <Menu size={16} className="text-slate-300" />
            </Link>
            <Link href="/catalogo" onClick={closeMenu} className="flex items-center justify-between border-b border-slate-50 pb-2">
              Catálogo <Menu size={16} className="text-slate-300" />
            </Link>
            <Link href="/nosotros" onClick={closeMenu} className="flex items-center justify-between border-b border-slate-50 pb-2">
              Nosotros <Menu size={16} className="text-slate-300" />
            </Link>
            <Link href="/contacto" onClick={closeMenu} className="flex items-center justify-between border-b border-slate-50 pb-2">
              Contacto <Menu size={16} className="text-slate-300" />
            </Link>

            {/* Botón de acción rápido en el móvil */}
            <Link
              href="/catalogo"
              onClick={closeMenu}
              className="mt-2 bg-blue-900 text-white text-center py-4 rounded-2xl shadow-lg shadow-blue-100"
            >
              Comprar Ahora
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        <CarritoProvider>
          <Navbar />
          <div className="pt-20 md:pt-20">
            {children}
          </div>
        </CarritoProvider>
      </body>
    </html>
  );
}