import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderStatusEmailData {
  customerEmail: string;
  customerName: string;
  orderId: number;
  status: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export async function sendOrderStatusEmail({
  customerEmail,
  customerName,
  orderId,
  status,
}: OrderStatusEmailData) {
  const statusLabel =
    statusLabels[status] ?? status;

  const { data, error } = await resend.emails.send({
    from: "Mundo Web <onboarding@resend.dev>",
    to: customerEmail,
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
            href="https://mundo-web-snowy.vercel.app/pedido/${orderId}?Email=${customerEmail}"
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
  });

  if (error) {
    console.error(
      "Error enviando correo:",
      error
    );

    throw error;
  }

  return data;
}