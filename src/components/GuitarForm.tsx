import { useState } from "react";
import type { FormEvent } from "react";
import { createGuitar } from "../api/guitars";
type GuitarFormProps = {
  onCreated: () => void;
};

type FormErrors = Partial<Record<keyof GuitarInput, string>>;

const IMAGES = Array.from({ length: 12 }, (_, i) => `guitarra_${String(i + 1).padStart(2, "0")}`);

const emptyForm = {brand:"", name: "", image: "", description: "", price: "" };

const MAX_DESCRIPTION = 500;


export default function GuitarForm({ onCreated }: GuitarFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = (): FormErrors => {

    const found: FormErrors = {};

    if (!form.brand.trim()) found.brand = "La marca es obligatoria";
    else if (form.brand.trim().length > 100) found.name = "La marca no puede pasar de 100 caracteres";

    if (!form.name.trim()) found.name = "El nombre es obligatorio";
    else if (form.name.trim().length > 100) found.name = "El nombre no puede pasar de 100 caracteres";

    if (!form.image) found.image = "Selecciona una imagen";

    if (!form.description.trim()) found.description = "La descripción es obligatoria";
    else if (form.description.trim().length > 500)
      found.description = "La descripción no puede pasar de 500 caracteres";

    const price = Number(form.price);
    if (form.price.trim() === "") found.price = "El precio es obligatorio";
    else if (Number.isNaN(price)) found.price = "El precio debe ser un número";
    else if (price <= 0) found.price = "El precio debe ser mayor a 0";
    return found;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const created = await createGuitar({
        brand: form.brand.trim(),
        name: form.name.trim(),
        image: form.image,
        description: form.description.trim(),
        price: Number(form.price),
      });
      setSuccess(`La guitarra "${created.name}" se guardó correctamente`);
      setForm(emptyForm);
      onCreated();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

 const cls = (base: string, field: keyof GuitarInput) =>
    `${base} ${errors[field] ? "gf-invalid" : ""}`;

  return (
   <section className="gf-section">
      <h2 className="text-center">Agregar Guitarra</h2>

      <form className="gf-card" onSubmit={handleSubmit} noValidate>
        <div className="gf-grid">
          <div className="gf-field">
            <label htmlFor="brand">Marca</label>
            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="Fender, Gibson, Ibanez..."
              className={cls("gf-input", "brand")}
              value={form.brand}
              onChange={handleChange}
            />
            {errors.brand && <span className="gf-error">{errors.brand}</span>}
          </div>

          <div className="gf-field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ej. Stratocaster"
              className={cls("gf-input", "name")}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="gf-error">{errors.name}</span>}
          </div>

          <div className="gf-field">
            <label htmlFor="price">Precio</label>
            <div className="gf-price">
              <span>$</span>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={cls("gf-input", "price")}
                value={form.price}
                onChange={handleChange}
              />
            </div>
            {errors.price && <span className="gf-error">{errors.price}</span>}
          </div>

          <div className="gf-field">
            <label htmlFor="image">Imagen</label>
            <div className="gf-preview">
              <select
                id="image"
                name="image"
                className={cls("gf-select", "image")}
                value={form.image}
                onChange={handleChange}
              >
                <option value="">-- Selecciona --</option>
                {IMAGES.map((img) => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
              {form.image && <img src={`/img/${form.image}.jpg`} alt="Vista previa" />}
            </div>
            {errors.image && <span className="gf-error">{errors.image}</span>}
          </div>

          <div className="gf-field gf-full">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe la guitarra..."
              className={cls("gf-textarea", "description")}
              value={form.description}
              onChange={handleChange}
            />
            <span className="gf-counter">{form.description.length}/{MAX_DESCRIPTION}</span>
            {errors.description && <span className="gf-error">{errors.description}</span>}
          </div>

          {serverError && (
            <div className="gf-full gf-alert gf-alert-error">{serverError}</div>
          )}
          {success && (
            <div className="gf-full gf-alert gf-alert-success">{success}</div>
          )}

          <div className="gf-full">
            <button type="submit" className="gf-button" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Guitarra"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
