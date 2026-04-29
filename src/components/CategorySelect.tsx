"use client";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

export default function CategorySelect({
  selectedRef,
  initialSelection,
}: {
  selectedRef: any;
  initialSelection: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedValue, setSelectedValue] = useState(initialSelection || "");

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    if (initialSelection) {
      setSelectedValue(initialSelection);
    }
  }, [initialSelection]);

  return (
    <div className="grow">
      <div className="mb-2 block">
        <label
          htmlFor="category"
          className="text-sm font-medium text-gray-900 dark:text-white"
        >
          Event Category
        </label>
      </div>
      <select
        ref={selectedRef}
        required
        name="eventCategory"
        id="category"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      >
        <option value="" disabled>
          Select Event Category
        </option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
