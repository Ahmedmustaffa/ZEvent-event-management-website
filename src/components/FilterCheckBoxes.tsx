"use client";
import { DropdownItem } from "flowbite-react";
import React from "react";
import { FaCheck } from "react-icons/fa6";

export default function FilterCheckBoxes({
  checked,
  category,
  handleAddFilter,
}: {
  checked: boolean;
  category: { _id: string; name: string | undefined };
  handleAddFilter: (categoryId: string, flag: boolean) => void;
}) {
  const handleChange = () => {
    handleAddFilter(category._id, checked);
  };

  return (
    <DropdownItem
      onClick={() => {
        handleChange();
      }}
      theme={{ icon: `${checked ? "visible" : "invisible"}` }}
      key={category._id}
      icon={FaCheck}
    >
      {category.name}
    </DropdownItem>
  );
}
