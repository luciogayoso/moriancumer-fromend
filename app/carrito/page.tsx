'use client';

import { useState, useEffect } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, Calculator, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

const TABLA_ZONAS = [
  { id: 'caba', nombre: 'CABA', costo: 4500 },
  { id: 'gba', nombre: 'GBA Norte/Sur', costo: 6500 },
  { id: 'interior', nombre: 'Interior del País', costo: 9800 },
  { id: 'retiro', nombre: 'Retiro en Local', costo: 0 },
];

export default function CarritoPage() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, totalItems } = useCarrito();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [zona, setZona] = useState(TABLA_ZONAS[0]);

  useEffect(() => { setIsMounted(true); }, []);

  const subtotal = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  
  // Lógica de Envío Gratis
  const montoEnvioGratis = 50000;
  const esEnvioGratis = subtotal >= montoEnvioGratis;
  const costoFinalEnvio = esEnvioGratis ? 0 : zona.costo;
  const totalFinal = subtotal + costoFinalEnvio;

  const handleCheckout = async () => {
    setIsLoading(true);
    setPreferenceId(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, envio: { ...zona, costo: costoFinalEnvio } }),
      });
      const data = await response.json();
      if (data.id) setPreferenceId(data.id);
    } catch (error) {
      alert("Error al conectar con Mercado Pago");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;
  if (carrito.length === 0) return <div className="p-20 text-center font-bold">Carrito Vacío</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-black text-blue-900 mb-10 tracking-tighter italic">CARRITO</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {/* Barra de progreso para envío gratis */}
          {!esEnvioGratis && (
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
              <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                <Truck size={18} /> 
                ¡Estás a <span className="font-bold">${montoEnvioGratis - subtotal}</span> del envío gratis!
              </p>
              <div className="w-full bg-blue-200 h-2 rounded-full mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(subtotal / montoEnvioGratis) * 100}%` }}
                />
              </div>
            </div>
          )}

          {carrito.map((item) => (
            <div key={item.producto.id} className="flex items-center gap-6 bg-white p-5 rounded-[24px] border shadow-sm">
              <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${item.producto.imagen_url}`} className="w-20 h-20 object-contain" alt={item.producto.nombre} />
              <div className="flex-1">
                <h3 className="font-bold">{item.producto.nombre}</h3>
                <p className="text-blue-600 font-black">${item.producto.precio}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center bg-slate-100 rounded-lg">
                    <button onClick={() => agregarAlCarrito(item.producto, -1)} className="p-2"><Minus size={14}/></button>
                    <span className="w-8 text-center font-bold">{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item.producto, 1)} className="p-2"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => eliminarDelCarrito(item.producto.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border shadow-xl sticky top-28">
            <h2 className="font-black text-xl mb-6 flex items-center gap-2"><Calculator /> RESUMEN</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-900">${subtotal}</span></div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Zona de Envío</label>
                <select 
                  className="w-full p-3 rounded-xl border bg-slate-50 text-xs font-bold"
                  onChange={(e) => setZona(TABLA_ZONAS.find(z => z.id === e.target.value)!)}
                  disabled={esEnvioGratis && zona.id !== 'retiro'}
                >
                  {TABLA_ZONAS.map(z => <option key={z.id} value={z.id}>{z.nombre} (+${z.costo})</option>)}
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Envío</span>
                {esEnvioGratis ? (
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> GRATIS
                  </span>
                ) : (
                  <span className="font-bold">${zona.costo}</span>
                )}
              </div>
              
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between items-end">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-black text-blue-900">${totalFinal}</span>
              </div>
            </div>

            <div className="mt-8">
              {preferenceId ? (
                <Wallet initialization={{ preferenceId }} customization={{ visual: { buttonBackground: 'black', borderRadius: '12px' } } as any} />
              ) : (
                <button
                  disabled={isLoading}
                  onClick={handleCheckout}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'CONFIRMAR PAGO'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}