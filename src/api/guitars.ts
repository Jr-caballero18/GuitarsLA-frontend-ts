const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type ApiErrorBody = {
  error?: string;
  errors?: { msg: string }[];
};

type GuitarRow = Omit<Guitar, "price"> & { price: string | number };

const toGuitar = (row: GuitarRow): Guitar => ({ ...row, price: Number(row.price) });

export async function getGuitars(): Promise<Guitar[]> {
  const response = await fetch(`${API_URL}/guitars`);
  if (!response.ok) {
    throw new Error("No se pudo cargar el catálogo desde el servidor");
  }
  const json: { data: GuitarRow[] } = await response.json();
  return json.data.map(toGuitar);
}

export async function createGuitar(input: GuitarInput): Promise<Guitar> {
  const response = await fetch(`${API_URL}/guitars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body: ApiErrorBody = await response.json().catch(() => ({}));
    const message =
      body.errors?.map((e) => e.msg).join(". ") ??
      body.error ??
      "No se pudo guardar la guitarra";
    throw new Error(message);
  }

  const json: { data: GuitarRow } = await response.json();
  return toGuitar(json.data);
}
