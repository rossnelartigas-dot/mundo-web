import { NextResponse } from "next/server";
import { sendOrderStatusEmail } from "@/services/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerEmail,
      customerName,
      orderId,
      status,
    } = body;

    if (
      !customerEmail ||
      !customerName ||
      !orderId ||
      !status
    ) {
      return NextResponse.json(
        {
          error: "Faltan datos para enviar el correo",
        },
        {
          status: 400,
        }
      );
    }

    await sendOrderStatusEmail({
      customerEmail,
      customerName,
      orderId,
      status,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Error enviando correo de estado:",
      error
    );

    return NextResponse.json(
      {
        error: "No se pudo enviar el correo",
      },
      {
        status: 500,
      }
    );
  }
}