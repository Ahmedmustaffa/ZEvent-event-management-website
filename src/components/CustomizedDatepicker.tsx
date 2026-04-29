"use client";
import { Datepicker } from "flowbite-react";
import React, { useState } from "react";

export function CustomizedDatepicker({
  name,
  required,
  setDateHandler,
  initialGivenDate,
}: {
  name: string;
  required: boolean;
  setDateHandler: (date: Date | null) => void;
  initialGivenDate: Date;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialGivenDate,
  );

  const dateChangeHandler = (date: Date | null) => {
    setSelectedDate(date);
    setDateHandler(date);
  };

  return (
    <Datepicker
      value={selectedDate}
      onChange={dateChangeHandler}
      required={required}
      name={name}
      theme={{
        root: {
          input: { field: { input: { base: "cursor-pointer" } } },
        },
      }}
      minDate={new Date()}
    ></Datepicker>
  );
}
