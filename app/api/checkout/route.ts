import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: (process.env.MP_ACCESS_TOKEN || '').trim(),
    options: { timeout: 7000 } // Reducimos el timeout para que no cuelgue tu server local
});

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
        }

        // SOLUCIÓN DEP0169: Usar la API WHATWG URL
        const baseUrl = new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000');

        const body = {
            items: items.map((item: any) => ({
                title: item.producto.nombre,
                unit_price: Number(item.producto.precio),
                quantity: Number(item.cantidad),
                currency_id: 'ARS',
            })),
            back_urls: {
                success: `${baseUrl.origin}/success`,
                failure: `${baseUrl.origin}/carrito`,
                pending: `${baseUrl.origin}/carrito`,
            },
            auto_return: 'approved',
        };

        const preference = await new Preference(client).create({ body });
        return NextResponse.json({ id: preference.id });

    } catch (error: any) {
        console.error("❌ ERROR EN MERCADO PAGO:", error.message);
        return NextResponse.json(
            { error: "Error de conexión local con Mercado Pago" },
            { status: 500 }
        );
    }
}