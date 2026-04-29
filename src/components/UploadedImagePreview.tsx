import React from "react";
import { GiCancel } from "react-icons/gi";

export function UploadedImagePreview({
  imageUrl,
  setImages,
}: {
  imageUrl: string;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="relative flex h-60 w-60 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
      <img
        src={imageUrl}
        alt="Preview"
        className="h-full w-full object-cover"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          setImages((prevImages) =>
            prevImages.filter((url) => url !== imageUrl),
          );
        }}
        className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-700"
      >
        <GiCancel />
      </button>
    </div>
  );
}
