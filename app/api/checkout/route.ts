import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// 1. Limpiamos el token para evitar espacios que retrasen la autenticación
const client = new MercadoPagoConfig({
    accessToken: (process.env.MP_ACCESS_TOKEN || '').trim()
});

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        // Validación rápida: si no hay ítems, cortamos la ejecución de inmediato
        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
        }

        // 2. Usar la API WHATWG URL para evitar el DeprecationWarning [DEP0169]
        const baseUrl = new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000').origin;

        const body = {
            items: items.map((item: any) => ({
                title: item.producto.nombre,
                // Forzamos el formato numérico correcto
                unit_price: Number(item.producto.precio),
                quantity: Number(item.cantidad),
                currency_id: 'ARS',
            })),
            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}/carrito`,
                pending: `${baseUrl}/carrito`,
            },
            auto_return: 'approved',
        };

        // 3. Crear la preferencia con un manejo de error específico
        const preference = await new Preference(client).create({ body });
        
        return NextResponse.json({ id: preference.id });

    } catch (error: any) {
        console.error("❌ ERROR EN MERCADO PAGO:");
        
        // Log detallado para identificar si el timeout es de MP o de red local
        if (error.response) {
            console.error("Detalle:", JSON.stringify(error.response, null, 2));
        } else {
            console.error("Mensaje:", error.message || error);
        }

        return NextResponse.json(
            { error: "Error de conexión con Mercado Pago", details: error.message },
            { status: 500 }
        );
    }
}