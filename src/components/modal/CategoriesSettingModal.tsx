"use client";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { TbFilterCog } from "react-icons/tb";
import { useToast } from "@/src/context/ToastContext";

interface ICategory {
  name: string;
  slug: string;
  _id: string;
}

export function CategoriesSettingModal({
  categories,
  setCategories,
}: {
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newName, setNewName] = useState("");
  const { showToast } = useToast();
  const resetForm = () => {
    setSelectedCategoryId("");
    setNewName("");
  };

  const handleActionChange = (id: string) => {
    setSelectedCategoryId(id);
    if (id === "") {
      setNewName("");
    } else {
      const category = categories.find((c) => c._id === id);
      setNewName(category?.name || "");
    }
  };

  const handleCategoryCreate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
        credentials: "include",
      });
      if (response.ok) {
        const createdCategory = await response.json();
        setCategories((prev) => [...prev, createdCategory]);
        showToast("Category created successfully!", "success");
        resetForm();
      }
    } catch (error) {
      showToast("Error creating category!", "failure");
    }
  };

  const handleCategoryUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${selectedCategoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
          credentials: "include",
        },
      );
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prev) =>
          prev.map((c) => (c._id === selectedCategoryId ? updatedCategory : c)),
        );
        showToast("Category updated successfully!", "success");
        resetForm();
      }
    } catch (error) {
      showToast("Error updating category!", "failure");
    }
  };

  const handleCategoryDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${selectedCategoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (response.ok) {
        setCategories((prev) =>
          prev.filter((c) => c._id !== selectedCategoryId),
        );
        showToast("Category deleted successfully!", "success");
        resetForm();
      }
    } catch (error) {
      showToast("Error deleting category!", "failure");
    }
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>
        <TbFilterCog className="h-5 w-5" />
      </Button>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        popup
        size="md"
        dismissible
      >
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Manage Categories
            </h3>

            <div>
              <Label htmlFor="selector">Select Action</Label>
              <Select
                id="selector"
                value={selectedCategoryId}
                onChange={(e) => handleActionChange(e.target.value)}
              >
                <option value="">+ Create New Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Category Name</Label>
              <TextInput
                id="name"
                placeholder="Enter category name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2">
              {selectedCategoryId === "" ? (
                <Button
                  className="w-full"
                  onClick={handleCategoryCreate}
                  disabled={!(newName.length >= 2)}
                >
                  Create
                </Button>
              ) : (
                <>
                  <Button
                    color="blue"
                    className="grow cursor-pointer"
                    onClick={handleCategoryUpdate}
                    disabled={!newName}
                  >
                    Update
                  </Button>
                  <Button
                    color="failer"
                    className="cursor-pointer bg-red-600 text-white hover:bg-red-800"
                    onClick={handleCategoryDelete}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
