'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Producto } from '@/types';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarAlCarrito: (producto: Producto, cantidad: number) => void;
  eliminarDelCarrito: (id: string | number) => void;
  totalItems: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  // Inicializamos el estado vacío
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  // 1. EFECTO DE CARGA: Se ejecuta una sola vez cuando la web abre
  useEffect(() => {
    const datosGuardados = localStorage.getItem('moriancumer_cart');
    if (datosGuardados) {
      try {
        setCarrito(JSON.parse(datosGuardados));
      } catch (error) {
        console.error("Error al cargar el carrito desde localStorage", error);
      }
    }
  }, []);

  // 2. EFECTO DE GUARDADO: Se ejecuta cada vez que el carrito cambia
  useEffect(() => {
    localStorage.setItem('moriancumer_cart', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto: Producto, cantidad: number) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      
      if (existe) {
        return prev.map(item => {
          if (item.producto.id === producto.id) {
            const nuevaCantidad = item.cantidad + cantidad;
            // Limitamos para que la cantidad mínima sea 1
            return { ...item, cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad };
          }
          return item;
        });
      }
      // Si el producto es nuevo, nos aseguramos de no añadirlo con cantidad < 1
      return [...prev, { producto, cantidad: cantidad < 1 ? 1 : cantidad }];
    });
  };

  const eliminarDelCarrito = (id: string | number) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== id));
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, totalItems }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return context;
};