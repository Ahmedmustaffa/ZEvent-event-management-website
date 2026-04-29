"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, HRText, Spinner } from "flowbite-react";
import { SubEventsForms } from "@/src/components/SubEventsForms";
import { MainEventForm } from "./MainEventForm";
import { ImgUpload } from "./ImgUpload";
import { structureEventData } from "./utils/eventHelpers";
import { useCloudinaryUpload } from "./hooks/useCloudinaryUpload";
import { UploadedImagePreview } from "./UploadedImagePreview";

export function NewEventForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const { uploadImages, isUploading } = useCloudinaryUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = await uploadImages(files);
    setImages([...images, ...urls]);
  };

  const formSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const structuredData = structureEventData(rawData, images);

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(structuredData),
        credentials: "include",
      });

      if (response.ok) {
        const res = await response.json();
        router.push(`/events/${res.data._id}`);
      }
    } catch (error) {
      console.error("Submission error", error);
    }
  };

  return (
    <Card className="w-full lg:w-[70%]">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
        Create New Event
      </h1>
      <form onSubmit={formSubmitHandler} className="space-y-6">
        <MainEventForm />

        <SectionDivider text="Sub Events" />
        <SubEventsForms />

        <SectionDivider text="Event Images" />
        <ImgUpload handleFileChange={handleFileChange} />

        {images.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <SectionDivider text="Preview" />
            {images.map((url, idx) => (
              <UploadedImagePreview
                key={idx}
                setImages={setImages}
                imageUrl={url}
              />
            ))}
          </div>
        )}
        <Button type="submit" disabled={isUploading} className="cursor-pointer">
          {isUploading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Uploading the images...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Card>
  );
}

const SectionDivider = ({ text }: { text: string }) => (
  <HRText text={text} theme={{ base: "relative", text: "dark:bg-gray-800" }} />
);
