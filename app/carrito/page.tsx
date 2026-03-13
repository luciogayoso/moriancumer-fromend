'use client';

import { useState, useEffect } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Inicialización con la llave pública desde variables de entorno
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

export default function CarritoPage() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, totalItems } = useCarrito();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar errores de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  const handleCheckout = async () => {
    setIsLoading(true);
    setPreferenceId(null); // Reiniciamos por si había uno previo
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito }),
      });
      
      const data = await response.json();
      
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        throw new Error("No se pudo obtener el ID de pago");
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      alert("Error de conexión. Prueba de nuevo en unos segundos.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  if (carrito.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Tu carrito está vacío</h2>
        <Link href="/catalogo" className="mt-8 bg-blue-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-blue-900 tracking-tighter uppercase">Tu Carrito</h1>
        <p className="text-slate-500 italic">{totalItems} artículos seleccionados.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Productos */}
        <div className="lg:col-span-2 space-y-6">
          {carrito.map((item) => (
            <div key={item.producto.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${item.producto.imagen_url}`}
                  alt={item.producto.nombre}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-900">{item.producto.nombre}</h3>
                <p className="text-blue-600 font-black text-lg">${item.producto.precio}</p>
                <div className="flex items-center justify-center sm:justify-start mt-4 gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                    <button onClick={() => agregarAlCarrito(item.producto, -1)} className="p-2 hover:text-blue-600"><Minus size={16} /></button>
                    <span className="font-bold w-8 text-center">{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item.producto, 1)} className="p-2 hover:text-blue-600"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => eliminarDelCarrito(item.producto.id)} className="p-3 text-slate-400 hover:text-red-500 transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen y Botón de Pago */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl sticky top-32">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Resumen</h2>
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-4xl font-black text-blue-900">${subtotal}</span>
            </div>

            {/* Si ya tenemos el ID, mostramos el botón oficial de MP */}
            {preferenceId ? (
              <Wallet initialization={{ preferenceId }} customization={{
                visual: {
                  buttonBackground: 'black',
                  borderRadius: '16px',
                }
              } as any} />
            ) : (
              <button
                disabled={isLoading}
                className="w-full bg-blue-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                onClick={handleCheckout}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Generar Orden de Pago'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}