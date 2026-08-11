import { NextResponse } from "next/server";
import { sendOrderStatusEmail } from "@/services/emailService";

export async function GET() {
  try {
    const email = "rossnelartigas@gmail.com";

    await sendOrderStatusEmail({
      customerEmail: email,
      customerName: "Cliente de prueba",
      orderId: 999,
      status: "paid",
    });

    return NextResponse.json({
      success: true,
      message: "Correo enviado correctamente",
    });
  } catch (error) {
    console.error("Error en prueba de correo:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error enviando correo",
      },
      {
        status: 500,
      }
    );
  }
}