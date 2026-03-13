'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/types';
import { Loader2, Package, ShoppingCart, Search, X, Plus, Minus } from 'lucide-react';
import { useCarrito } from '@/context/CarritoContext';

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtro, setFiltro] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const { agregarAlCarrito } = useCarrito();
  const [cantidadTemp, setCantidadTemp] = useState(1);

  const categorias: string[] = ['Todos', 'Misión', 'Templos', 'Jesucristo', 'Familias'];

  // Carga de productos desde Supabase
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      
      let query = supabase
        .from('productos')
        .select('*, categorias!inner(nombre)');

      if (filtro !== 'Todos') {
        query = query.eq('categorias.nombre', filtro);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error cargando productos:", error);
      } else {
        setProductos(data as Producto[]);
      }
      setLoading(false);
    };

    cargarProductos();
  }, [filtro]);

  // Lógica de cantidad
  const incrementar = () => setCantidadTemp(prev => prev + 1);
  const decrementar = () => setCantidadTemp(prev => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    if (selectedProduct) {
      agregarAlCarrito(selectedProduct, cantidadTemp);
      setSelectedProduct(null);
      setCantidadTemp(1);
    }
  };

  // Lógica de la Lupa (Zoom) - Solo funcional en Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-900">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      <header className="mb-8 md:mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tighter uppercase">Catálogo</h1>
        <p className="text-slate-500 italic text-sm md:text-base">Detalles que fortalecen la fe.</p>
      </header>

      {/* Filtros: Con scroll horizontal en móvil */}
      <div className="flex gap-3 mb-8 md:mb-12 overflow-x-auto pb-4 no-scrollbar">
        {categorias.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFiltro(cat)}
            className={`px-6 md:px-8 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              filtro === cat 
                ? 'bg-blue-900 text-white shadow-lg' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {productos.map((p) => (
          <div key={p.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
            <div className="relative h-64 bg-slate-50 overflow-hidden">
              <img 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${p.imagen_url}`}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                alt={p.nombre}
              />
              <button 
                onClick={() => setSelectedProduct(p)}
                className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div className="bg-white p-3 rounded-full text-blue-900 shadow-xl scale-75 group-hover:scale-100 transition-transform">
                  <Search size={22} />
                </div>
              </button>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="font-bold text-slate-800 text-lg leading-tight mb-1">{p.nombre}</h2>
              <p className="text-blue-900 font-black text-xl mb-4">${p.precio}</p>
              <button 
                onClick={() => setSelectedProduct(p)}
                className="w-full mt-auto py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-colors"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE DETALLE CORREGIDO PARA MÓVIL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 md:p-10">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          {/* Contenedor Modal */}
          <div className="relative bg-white w-full max-w-5xl max-h-[95vh] rounded-[30px] md:rounded-[40px] shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            
            {/* Botón Cerrar (Mejorado para móvil) */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition"
            >
              <X size={24} />
            </button>

            {/* Columna Imagen */}
            <div 
              className="w-full md:w-1/2 min-h-[300px] md:h-auto bg-slate-50 relative overflow-hidden flex items-center justify-center"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${selectedProduct.imagen_url}`}
                className="w-full h-full max-h-[400px] md:max-h-full object-contain p-8 md:p-12"
                alt={selectedProduct.nombre}
              />
              
              {/* Zoom exclusivo Desktop */}
              {showZoom && (
                <div 
                  className="hidden md:block absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${selectedProduct.imagen_url})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}
            </div>

            {/* Columna Información */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                {selectedProduct.categorias?.nombre}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-2 leading-tight">
                {selectedProduct.nombre}
              </h2>
              
              <div className="h-1 w-12 bg-blue-600 my-4 md:my-6" />
              
              <p className="text-slate-500 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                {selectedProduct.descripcion || "Una pieza única fabricada con polímeros de alta resistencia y terminación artesanal, perfecta para inspirar tu día a día."}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <span className="text-3xl md:text-4xl font-black text-slate-900">${selectedProduct.precio}</span>
                
                {/* Selector de Cantidad Funcional */}
                <div className="flex items-center border-2 border-slate-100 rounded-2xl p-1 bg-slate-50/50">
                  <button 
                    onClick={decrementar}
                    className="p-2 hover:bg-white hover:text-blue-600 rounded-xl transition-all"
                  >
                    <Minus size={20}/>
                  </button>
                  <span className="font-bold w-10 text-center text-lg">{cantidadTemp}</span>
                  <button 
                    onClick={incrementar}
                    className="p-2 hover:bg-white hover:text-blue-600 rounded-xl transition-all"
                  >
                    <Plus size={20}/>
                  </button>
                </div>
              </div>

              <button 
                className="w-full bg-blue-900 text-white py-4 md:py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                onClick={handleAdd}
              >
                <ShoppingCart size={22} /> Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}