import nodemailer from "nodemailer";

// Configuración del transporte con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Soporta tanto códigos en inglés como nombres en español
const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  Pendiente: "Pendiente",
  Confirmado: "Confirmado",
  Pagado: "Pagado",
  Preparando: "Preparando",
  Enviado: "Enviado",
  Entregado: "Entregado",
  Cancelado: "Cancelado",
};

interface OrderStatusEmailData {
  customerEmail: string;
  customerName: string;
  orderId: number | string;
  status: string;
}

interface OrderCreatedEmailData {
  customerEmail: string;
  customerName: string;
  orderId: number | string;
  totalUsd?: number | string;
  items?: Array<{ name: string; quantity: number; price?: number }>;
}

/**
  1. Correo enviado INMEDIATAMENTE al crear la orden (Checkout)
 */
export async function sendOrderCreatedEmail({
  customerEmail,
  customerName,
  orderId,
  totalUsd,
  items = [],
}: OrderCreatedEmailData) {
  const itemsHtml = items.length
    ? `
      <div style="margin:20px 0; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; padding:15px 0;">
        <h3 style="margin-0 0 10px; color:#0f172a; font-size:16px;">Resumen del pedido:</h3>
        <ul style="padding-left:20px; margin:0; color:#475569;">
          ${items
            .map(
              (item) =>
                `<li style="margin-bottom:6px;"><strong>${item.quantity}x</strong> ${item.name}</li>`
            )
            .join("")}
        </ul>
      </div>
    `
    : "";

  const mailOptions = {
    from: `"Mundo Web" <${process.env.GMAIL_USER}>`,
    to: customerEmail.trim().toLowerCase(),
    subject: `¡Hemos recibido tu pedido #${orderId}! - Mundo Web`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:16px; padding:30px; border:1px solid #e2e8f0;">
          
          <h1 style="color:#0891b2; margin-bottom:10px;">Mundo Web</h1>

          <h2 style="color:#0f172a; margin-top:0;">¡Gracias por tu compra!</h2>

          <p style="color:#475569;">
            Hola <strong>${customerName}</strong>,
          </p>

          <p style="color:#475569;">
            Hemos recibido tu pedido <strong>#${orderId}</strong> con éxito y se encuentra registrado con el estado <strong style="color:#0891b2;">Pendiente</strong> de verificación.
          </p>

          ${itemsHtml}

          ${
            totalUsd
              ? `<p style="font-size:18px; color:#0f172a;"><strong>Total a pagar:</strong> $${Number(totalUsd).toFixed(2)} USD</p>`
              : ""
          }

          <p style="color:#475569;">
            Puedes seguir el estado de tu compra en tiempo real usando el siguiente botón:
          </p>

          <a
            href="https://mundo-web-snowy.vercel.app/pedido/${orderId}?email=${encodeURIComponent(
              customerEmail.trim().toLowerCase()
            )}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display:inline-block;
              margin-top:15px;
              padding:12px 20px;
              background:#0891b2;
              color:white;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Ver detalle de mi pedido
          </a>

          <p style="margin-top:30px; color:#94a3b8; font-size:13px;">
            Este correo fue enviado automáticamente por Mundo Web.
          </p>

        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Correo de confirmación de pedido #${orderId} enviado a ${customerEmail}`);
    return info;
  } catch (error) {
    console.error("❌ Error enviando correo de nuevo pedido:", error);
    // No lanzamos el error para no interrumpir el flujo de compra del usuario si falla el envío
  }
}

/**
  2. Correo de actualización de estado (Admin)
 */
export async function sendOrderStatusEmail({
  customerEmail,
  customerName,
  orderId,
  status,
}: OrderStatusEmailData) {
  const statusLabel = statusLabels[status] ?? status;

  const mailOptions = {
    from: `"Mundo Web" <${process.env.GMAIL_USER}>`,
    to: customerEmail.trim().toLowerCase(),
    subject: `Actualización de tu pedido #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:16px; padding:30px; border:1px solid #e2e8f0;">
          
          <h1 style="color:#0891b2; margin-bottom:10px;">
            Mundo Web
          </h1>

          <h2 style="color:#0f172a;">
            Actualización de tu pedido
          </h2>

          <p style="color:#475569;">
            Hola <strong>${customerName}</strong>,
          </p>

          <p style="color:#475569;">
            Tu pedido <strong>#${orderId}</strong> ha sido actualizado.
          </p>

          <div style="background:#f1f5f9; padding:20px; border-radius:12px; margin:25px 0;">
            <p style="margin:0; color:#64748b;">
              Estado actual
            </p>

            <p style="margin:8px 0 0; font-size:24px; font-weight:bold; color:#0891b2;">
              ${statusLabel}
            </p>
          </div>

          <p style="color:#475569;">
            Puedes consultar el estado de tu pedido desde nuestra tienda.
          </p>

          <a
            href="https://mundo-web-snowy.vercel.app/pedido/${orderId}?email=${encodeURIComponent(
              customerEmail.trim().toLowerCase()
            )}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display:inline-block;
              margin-top:15px;
              padding:12px 20px;
              background:#0891b2;
              color:white;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Consultar mi pedido
          </a>

          <p style="margin-top:30px; color:#94a3b8; font-size:13px;">
            Este correo fue enviado automáticamente por Mundo Web.
          </p>

        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ Error enviando correo con Nodemailer:", error);
    throw error;
  }
}