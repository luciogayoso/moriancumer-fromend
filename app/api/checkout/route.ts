import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: (process.env.MP_ACCESS_TOKEN || '').trim()
});

export async function POST(request: Request) {
    try {
        const { items, envio } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
        }

        const baseUrl = new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000').origin;

        // Calcular subtotal para verificar si aplica envío gratis
        const subtotal = items.reduce((acc: number, item: any) => 
            acc + (Number(item.producto.precio) * Number(item.cantidad)), 0
        );

        // El envío es gratis si supera los 50.000
        const esEnvioGratis = subtotal >= 50000;

        const itemsParaPago = [
            ...items.map((item: any) => ({
                title: item.producto.nombre,
                unit_price: Number(item.producto.precio),
                quantity: Number(item.cantidad),
                currency_id: 'ARS',
            })),
        ];

        // Solo agregamos el costo de envío si NO es gratis y la zona tiene costo
        if (!esEnvioGratis && envio && envio.costo > 0) {
            itemsParaPago.push({
                title: `Envío: ${envio.nombre}`,
                unit_price: Number(envio.costo),
                quantity: 1,
                currency_id: 'ARS',
            });
        }

        const body = {
            items: itemsParaPago,
            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}/carrito`,
                pending: `${baseUrl}/carrito`,
            },
            auto_return: 'approved',
        };

        const preference = await new Preference(client).create({ body });
        return NextResponse.json({ id: preference.id });

    } catch (error: any) {
        console.error("❌ ERROR MP:", error.message);
        return NextResponse.json({ error: "Error al crear pago" }, { status: 500 });
    }
}