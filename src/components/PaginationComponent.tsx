"use client";

import { Pagination } from "flowbite-react";
import { useState } from "react";

export function PaginationComponent({
  totalPages,
  getEvents,
}: {
  totalPages: number;
  getEvents: (limit: number, offset: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    getEvents(5, (page - 1) * 5);
  };

  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
