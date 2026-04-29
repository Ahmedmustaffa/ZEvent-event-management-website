import { useState } from "react";

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (files: File[]) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dkrg4kpnh/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }
      return uploadedUrls;
    } catch (error) {
      console.error("Upload failed", error);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImages, isUploading };
}
