import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        const body = {
            items: items.map((item: any) => ({
                title: item.producto.nombre,
                unit_price: Number(item.producto.precio),
                quantity: Number(item.cantidad),
                currency_id: 'ARS',
            })),
            back_urls: {
                success: String(process.env.NEXT_PUBLIC_URL + "/success"),
                failure: String(process.env.NEXT_PUBLIC_URL + "/carrito"),
                pending: String(process.env.NEXT_PUBLIC_URL + "/carrito"),
            },
            //auto_return: 'approved',
        };

        const preference = await new Preference(client).create({ body });
        return NextResponse.json({ id: preference.id });

    } catch (error: any) {
        console.error("❌ ERROR EN MERCADO PAGO:");
        if (error.response) {
            console.error("Detalle:", JSON.stringify(error.response, null, 2));
        } else {
            console.error("Mensaje:", error.message || error);
        }

        return NextResponse.json(
            { error: "Error al crear la preferencia", details: error.message },
            { status: 500 }
        );
    }
}