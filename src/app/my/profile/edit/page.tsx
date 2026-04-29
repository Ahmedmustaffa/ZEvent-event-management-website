"use client";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext"; // Using the toast logic we built earlier
import { useCloudinaryUpload } from "@/src/components/hooks/useCloudinaryUpload";
import {
  Button,
  Card,
  Label,
  TextInput,
  Spinner,
  HelperText,
} from "flowbite-react";
import { ImgUpload } from "@/src/components/ImgUpload";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { uploadImages, isUploading } = useCloudinaryUpload();
  const router = useRouter();

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = await uploadImages(files);
    if (urls.length > 0) {
      setAvatarPreview(urls[0]);
      showToast("Image uploaded successfully", "success");
    }
  };

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const updateData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      avatar: avatarPreview,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      if (res.ok) {
        showToast(
          "Profile updated! Please log in again to see changes.",
          "success",
        );
        router.push("/my/profile");
      } else {
        const error = await res.json();
        showToast(error.message || "Update failed", "failure");
      }
    } catch (err) {
      showToast("Server error", "failure");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex grow flex-col items-center bg-gray-50 p-8 dark:bg-gray-900">
      <Card className="w-full max-w-xl">
        <h3 className="text-xl font-bold dark:text-white">Edit Profile</h3>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <img
              src={avatarPreview || "/usericon.svg"}
              className="h-24 w-24 rounded-full border object-cover"
              alt="Avatar Preview"
            />
            <ImgUpload
              handleFileChange={handleAvatarChange}
              singleFile={true}
            />
            {isUploading && <Spinner size="sm" />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <TextInput
                name="firstName"
                defaultValue={user?.firstName}
                required
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <TextInput
                name="lastName"
                defaultValue={user?.lastName}
                required
              />
            </div>
          </div>

          <div>
            <span className="flex items-center gap-1">
              <Label>Email</Label>
              <HelperText className="mb-2">(email is not editable) </HelperText>
            </span>
            <TextInput
              name="email"
              type="email"
              defaultValue={user?.email}
              readOnly
              disabled
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="grow"
            >
              {isSaving ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button color="gray" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
