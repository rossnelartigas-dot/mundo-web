import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id || !email) {
      return NextResponse.json(
        {
          error:
            "Debes ingresar el número de pedido y el correo electrónico.",
        },
        {
          status: 400,
        }
      );
    }

    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        {
          error:
            "El número de pedido no es válido.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .eq(
        "customer_email",
        email.trim()
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Error consultando pedido:",
        error
      );

      return NextResponse.json(
        {
          error:
            "No se pudo consultar el pedido.",
        },
        {
          status: 500,
        }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "No encontramos un pedido con esos datos.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      id: data.id,
    });
  } catch (error) {
    console.error(
      "Error en API de consulta:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ocurrió un error al consultar el pedido.",
      },
      {
        status: 500,
      }
    );
  }
}