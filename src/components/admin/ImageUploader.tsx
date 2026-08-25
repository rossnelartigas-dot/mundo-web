"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrashAlt, FaImage } from "react-icons/fa";

interface Props {
  onImageChange: (file: File | null) => void;
  imageUrl?: string;
}

export default function ImageUploader({
  onImageChange,
  imageUrl,
}: Props) {
  const initialPreview =
    typeof imageUrl === "string" ? imageUrl : "";

  const [preview, setPreview] = useState<string>(initialPreview);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen (PNG, JPG, WEBP, etc.)");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar 5MB");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
    onImageChange(file);
  }

  function removeImage() {
    setPreview("");
    onImageChange(null);
  }

  const isBlobImage =
    typeof preview === "string" &&
    preview.startsWith("blob:");

  return (
    <div className="space-y-4">
      {/* SUBIR IMAGEN */}
      <div>
        <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
          Subir archivo desde PC
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="
            w-full
            rounded-xl
            border
            border-slate-800
            bg-slate-950/80
            p-2.5
            text-xs
            font-mono
            text-slate-300
            transition-all
            file:mr-4
            file:cursor-pointer
            file:rounded-lg
            file:border-0
            file:bg-cyan-500/10
            file:px-4
            file:py-2
            file:font-mono
            file:text-xs
            file:font-bold
            file:text-cyan-400
            file:transition
            hover:border-cyan-500/50
            hover:file:bg-cyan-500/20
            focus:border-cyan-500
            focus:outline-none
            focus:ring-1
            focus:ring-cyan-500/50
          "
        />
      </div>

      {/* PREVISUALIZACIÓN */}
      {preview ? (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-inner">
          <div className="relative mx-auto h-64 w-full max-w-md">
            <Image
              src={preview}
              alt="Vista previa del producto"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 448px"
              unoptimized={isBlobImage}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={removeImage}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-rose-500/30
                bg-rose-500/10
                px-3.5
                py-2
                font-mono
                text-xs
                font-semibold
                text-rose-400
                transition-all
                hover:border-rose-500/60
                hover:bg-rose-500/20
                hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]
              "
            >
              <FaTrashAlt size={12} />
              Eliminar imagen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center transition hover:border-slate-700">
          <FaImage className="text-slate-600" size={24} />
          <span className="font-mono text-xs text-slate-500">
            [ SIN IMAGEN SELECCIONADA ]
          </span>
          <span className="font-mono text-[11px] text-slate-600">
            Formatos: PNG, JPG, WEBP (Máximo 5MB)
          </span>
        </div>
      )}
    </div>
  );
}