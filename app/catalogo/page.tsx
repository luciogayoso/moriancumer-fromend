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
  const { agregarAlCarrito } = useCarrito(); // <--- Traemos la función de la "nube"
  const [cantidadTemp, setCantidadTemp] = useState(1);

  const categorias: string[] = ['Todos', 'Misión', 'Templos', 'Jesucristo', 'Familias'];

  useEffect(() => {
  const cargarProductos = async () => {
    setLoading(true);
    
    // 1. Empezamos la query
    let query = supabase
      .from('productos')
      .select('*, categorias!inner(nombre)'); // El !inner es clave para filtrar por relación

    // 2. Si hay filtro, aplicamos el filtro a la tabla relacionada
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

const handleAdd = () => {
    if (selectedProduct) {
      agregarAlCarrito(selectedProduct, cantidadTemp);
      setSelectedProduct(null);
      setCantidadTemp(1);
    }
  };


  // Lógica de la Lupa (Zoom)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-blue-900 tracking-tighter uppercase">Catálogo</h1>
        <p className="text-slate-500 italic">Detalles que fortalecen la fe.</p>
      </header>

      {/* Filtros */}
      <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
        {categorias.map(cat => (
          <button key={cat} onClick={() => setFiltro(cat)}
            className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${
              filtro === cat ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-500 border'
            }`}>{cat}</button>
        ))}
      </div>

      {/* Grilla de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map((p) => (
          <div key={p.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-64 bg-slate-50">
              <img 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${p.imagen_url}`}
                className="w-full h-full object-contain p-4"
                alt={p.nombre}
              />
              {/* Botón Lupa / Ver Detalle */}
              <button 
                onClick={() => setSelectedProduct(p)}
                className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div className="bg-white p-3 rounded-full text-blue-900 shadow-xl scale-75 group-hover:scale-100 transition-transform">
                  <Search size={24} />
                </div>
              </button>
            </div>
            <div className="p-5">
              <h2 className="font-bold text-slate-800">{p.nombre}</h2>
              <p className="text-blue-900 font-black mt-2 text-xl">${p.precio}</p>
              <button 
                onClick={() => setSelectedProduct(p)}
                className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE DETALLE CON ZOOM --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-20 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition"
            >
              <X size={24} />
            </button>

            {/* Imagen con Zoom */}
            <div 
              className="w-full md:w-1/2 h-[400px] md:h-auto bg-slate-50 relative overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${selectedProduct.imagen_url}`}
                className="w-full h-full object-contain p-10"
                alt={selectedProduct.nombre}
              />
              
              {showZoom && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos-imagenes/${selectedProduct.imagen_url})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%', // Nivel de zoom
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}
            </div>

            {/* Detalles y Compra */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                {selectedProduct.categorias?.nombre}
              </span>
              <h2 className="text-4xl font-black text-slate-900 mt-2 leading-tight">
                {selectedProduct.nombre}
              </h2>
              <div className="h-1 w-12 bg-blue-600 my-6" />
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                {selectedProduct.descripcion || "Una pieza única fabricada con polímeros de alta resistencia y terminación artesanal, perfecta para inspirar tu día a día."}
              </p>
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-black text-slate-900">${selectedProduct.precio}</span>
                <div className="flex items-center border rounded-2xl p-2 gap-4">
                  <button className="p-1 hover:text-blue-600"><Minus size={20}/></button>
                  <span className="font-bold w-4 text-center">1</span>
                  <button className="p-1 hover:text-blue-600"><Plus size={20}/></button>
                </div>
              </div>

              <button 
                className="w-full bg-blue-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
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