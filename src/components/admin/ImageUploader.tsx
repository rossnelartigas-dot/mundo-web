"use client";

import { useState } from "react";
import Image from "next/image";

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
      alert("Solo se permiten imágenes");
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Subir imagen desde PC
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="
            w-full
            rounded-lg
            border
            border-gray-300
            bg-white
            p-3
            text-sm
            text-gray-700
            transition
            file:mr-4
            file:rounded-md
            file:border-0
            file:bg-cyan-50
            file:px-4
            file:py-2
            file:font-medium
            file:text-cyan-700
            hover:file:bg-cyan-100
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
          "
        />
      </div>

      {/* PREVISUALIZACIÓN */}
      {preview ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">
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
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <span className="text-sm text-gray-400">
            [ SIN IMAGEN ]
          </span>
        </div>
      )}

      {/* ELIMINAR */}
      {preview && (
        <button
          type="button"
          onClick={removeImage}
          className="
            cursor-pointer
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-red-700
          "
        >
          Eliminar imagen
        </button>
      )}
    </div>
  );
}