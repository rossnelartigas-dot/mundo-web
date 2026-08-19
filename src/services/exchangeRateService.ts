export interface ExchangeRate {
  rate: number;
  currency: "USD";
  source: string;
  updatedAt?: string;
}

const BCV_API_URL = "https://rates.dolarvzla.com/bcv/current.json";

export async function getBcvRate(): Promise<ExchangeRate | null> {
  try {
    const response = await fetch(BCV_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Error obteniendo tasa BCV: ${response.status}`
      );
    }

    const data = await response.json();

    /*
     * Estructura actual de DolarVZLA:
     *
     * {
     *   current: {
     *     date: "2026-08-19",
     *     usd: 775.3356,
     *     eur: 897.8231
     *   }
     * }
     */

    const rate = Number(data?.current?.usd);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("La tasa BCV recibida no es válida");
    }

    return {
      rate,
      currency: "USD",
      source: "BCV",
      updatedAt: data?.current?.date,
    };
  } catch (error) {
    console.error("Error obteniendo tasa BCV:", error);

    return null;
  }
}