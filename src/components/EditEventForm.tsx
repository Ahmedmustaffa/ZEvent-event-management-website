"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, HRText, Spinner } from "flowbite-react";
import { MainEventForm } from "./MainEventForm";
import { SubEventsForms } from "./SubEventsForms";
import { ImgUpload } from "./ImgUpload";
import { structureEventData } from "./utils/eventHelpers";
import { useCloudinaryUpload } from "./hooks/useCloudinaryUpload";
import { UploadedImagePreview } from "./UploadedImagePreview";

export function EditEventForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(
    initialData.eventImagesSrc || [],
  );
  const { uploadImages, isUploading } = useCloudinaryUpload();

  const formSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const structuredData = structureEventData(rawData, images);

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${initialData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(structuredData),
          credentials: "include",
        },
      );

      if (response.ok) {
        router.push(`/events/${initialData._id}`);
      }
    } catch (error) {
      console.error("Update error", error);
    }
  };

  return (
    <Card className="w-full lg:w-[70%]">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">
          Edit Event: {initialData.mainTitle}
        </h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            router.push(`/events/${initialData._id}`);
          }}
        >
          Cancel Update
        </Button>
      </div>
      <form onSubmit={formSubmitHandler} className="space-y-6">
        <MainEventForm initialData={initialData} />
        <SectionDivider text="Sub Events" />

        <SubEventsForms initialData={initialData.subEvents} />
        <SectionDivider text="Event Images" />

        <ImgUpload
          handleFileChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files);
            const urls = await uploadImages(files);
            setImages([...images, ...urls]);
          }}
        />
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
        <div className="flex gap-3">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? <Spinner size="sm" /> : "Update Event"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

const SectionDivider = ({ text }: { text: string }) => (
  <HRText text={text} theme={{ base: "relative", text: "dark:bg-gray-800" }} />
);
