'use client';

import { useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

export default function CarritoPage() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, totalItems } = useCarrito();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular el subtotal sumando (precio * cantidad) de cada item
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito }),
      });
      const data = await response.json();
      setPreferenceId(data.id);
    } catch (error) {
      console.error("Error en el checkout:", error);
      alert("Hubo un error al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };
  // Estado vacío: Si no hay productos en el carrito
  if (carrito.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Tu carrito está vacío</h2>
        <p className="text-slate-500 mt-2 max-w-xs">
          Parece que aún no has añadido ningún tesoro a tu colección.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-blue-900 tracking-tighter uppercase">Tu Carrito</h1>
        <p className="text-slate-500 italic">{totalItems} artículos listos para fortalecer tu fe.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LISTA DE PRODUCTOS (Columna Izquierda) */}
        <div className="lg:col-span-2 space-y-6">
          {carrito.map((item) => (
            <div
              key={item.producto.id}
              className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              {/* Imagen */}
              <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${item.producto.imagen_url}`}
                  alt={item.producto.nombre}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* Información */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-900">{item.producto.nombre}</h3>
                <p className="text-blue-600 font-black text-lg mt-1">${item.producto.precio}</p>

                {/* Controles de Cantidad */}
                <div className="flex items-center justify-center sm:justify-start mt-4 gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                    <button
                      onClick={() => agregarAlCarrito(item.producto, -1)}
                      className="p-2 hover:text-blue-600 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-8 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => agregarAlCarrito(item.producto, 1)}
                      className="p-2 hover:text-blue-600 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => eliminarDelCarrito(item.producto.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Subtotal por Item */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</p>
                <p className="text-2xl font-black text-slate-900">${item.producto.precio * item.cantidad}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN DE COMPRA (Columna Derecha / Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl sticky top-32">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Resumen</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Envío</span>
                <span className="text-green-600 font-bold uppercase text-xs">Calculado al pagar</span>
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-4xl font-black text-blue-900">${subtotal}</span>
              </div>
            </div>

            {preferenceId ? (
              <Wallet initialization={{ preferenceId }} customization={{
                visual: {
                  buttonBackground: 'default',
                  borderRadius: '16px',
                }
              } as any} />
            ) : (
              <button
                disabled={isLoading}
                className="w-full bg-blue-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                onClick={handleCheckout}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Pagar con Mercado Pago'}
              </button>
            )}

            <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
              Pago seguro vía Mercado Pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}