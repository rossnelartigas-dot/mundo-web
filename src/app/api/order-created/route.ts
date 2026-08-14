import { NextResponse } from "next/server";
import { sendOrderCreatedEmail } from "@/services/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerEmail,
      customerName,
      orderId,
      totalUsd,
      items,
    } = body;

    if (!customerEmail || !customerName || !orderId) {
      return NextResponse.json(
        {
          error: "Faltan datos requeridos (customerEmail, customerName u orderId)",
        },
        {
          status: 400,
        }
      );
    }

    await sendOrderCreatedEmail({
      customerEmail,
      customerName,
      orderId,
      totalUsd,
      items,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error enviando correo de nuevo pedido:", error);

    return NextResponse.json(
      {
        error: "No se pudo enviar el correo de creación de pedido",
      },
      {
        status: 500,
      }
    );
  }
}