export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria_id: string;
  categorias?: Categoria; // Relación de Supabase
}

export interface CartItem extends Producto {
  cantidad: number;
}