'use client';

import { useState, useEffect } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2, Calculator, Truck } from 'lucide-react';
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
  const totalFinal = subtotal + zona.costo;

  const handleCheckout = async () => {
    setIsLoading(true);
    setPreferenceId(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, envio: zona }),
      });
      const data = await response.json();
      if (data.id) setPreferenceId(data.id);
    } catch (error) {
      alert("Error al conectar con la pasarela de pagos");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;
  if (carrito.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <ShoppingBag size={48} className="text-slate-300 mb-4" />
      <h2 className="text-xl font-bold">Tu carrito está vacío</h2>
      <Link href="/catalogo" className="mt-4 text-blue-600 font-bold">Volver a la tienda</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-black text-blue-900 mb-10 tracking-tighter">TU PEDIDO</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {carrito.map((item) => (
            <div key={item.producto.id} className="flex items-center gap-6 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
              <img 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${item.producto.imagen_url}`} 
                className="w-20 h-20 object-contain bg-slate-50 rounded-xl" 
                alt={item.producto.nombre} 
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{item.producto.nombre}</h3>
                <p className="text-blue-600 font-black">${item.producto.precio}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center bg-slate-100 rounded-lg px-2">
                    <button onClick={() => agregarAlCarrito(item.producto, -1)} className="p-1"><Minus size={14}/></button>
                    <span className="w-8 text-center font-bold text-sm">{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item.producto, 1)} className="p-1"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => eliminarDelCarrito(item.producto.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border shadow-xl sticky top-28">
            <div className="flex items-center gap-2 mb-6"><Calculator className="text-blue-600" /> <h2 className="font-black text-xl">RESUMEN</h2></div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-900">${subtotal}</span></div>
              
              <div className="pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Seleccionar Zona de Envío</label>
                <select 
                  className="w-full p-3 rounded-xl border bg-slate-50 text-xs font-bold"
                  onChange={(e) => setZona(TABLA_ZONAS.find(z => z.id === e.target.value)!)}
                >
                  {TABLA_ZONAS.map(z => <option key={z.id} value={z.id}>{z.nombre} (+${z.costo})</option>)}
                </select>
              </div>

              <div className="flex justify-between text-slate-500 pt-2">
                <span className="flex items-center gap-1"><Truck size={14}/> Envío</span>
                <span className="font-bold text-green-600">{zona.costo === 0 ? 'GRATIS' : `$${zona.costo}`}</span>
              </div>
              
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between items-end"><span className="font-bold text-lg">Total</span><span className="text-3xl font-black text-blue-900">${totalFinal}</span></div>
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