"use client";
import React, { useState } from "react";
import FilterCheckBoxes from "./FilterCheckBoxes";
import { FaCheck } from "react-icons/fa6";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";

interface ICategory {
  name: string;
  slug: string;
  _id: string;
}

export default function Filter({
  filters,
  handleAddFilter,
  showAvailableOnly,
  availableOnly,
  categories,
  setCategories,
}: {
  handleAddFilter: (categoryId: string, flag: boolean) => void;
  showAvailableOnly: React.Dispatch<React.SetStateAction<boolean>>;
  availableOnly: boolean;
  filters: Set<string>;
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}) {
  return (
    <div className="flex w-[60%] gap-5">
      <Dropdown dismissOnClick={false} label="Filter">
        {categories.map((category) => (
          <FilterCheckBoxes
            checked={filters.has(category._id)}
            key={category._id}
            category={category}
            handleAddFilter={handleAddFilter}
          />
        ))}
        <DropdownDivider />
        <DropdownItem
          theme={{ icon: `${availableOnly ? "visible" : "invisible"}` }}
          onClick={() => {
            showAvailableOnly((prev) => !prev);
          }}
          icon={FaCheck}
        >
          Available Only
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
