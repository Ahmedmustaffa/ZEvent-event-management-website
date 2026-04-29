"use client";
import React, { useState } from "react";
import { Label, TextInput, Textarea, Button, HelperText } from "flowbite-react";
import { HiPlus, HiTrash } from "react-icons/hi";
import { CustomizedDatepicker } from "./CustomizedDatepicker";

export function SubEventsForms({ initialData }: { initialData?: any[] }) {
  const [subEvents, setSubEvents] = useState(
    initialData
      ? initialData.map((sub) => ({
          ...sub,
          id: Math.random(),
          startDate: new Date(sub.startDate),
          endDate: new Date(sub.endDate),
          isValid: true,
        }))
      : [
          {
            id: Date.now(),
            startDate: new Date(),
            endDate: new Date(),
            isValid: true,
          },
        ],
  );

  const addSubEvent = () => {
    if (subEvents.length < 5) {
      setSubEvents([
        ...subEvents,
        {
          id: Date.now(),
          startDate: new Date(),
          endDate: new Date(),
          isValid: true,
        },
      ]);
    }
  };

  const removeSubEvent = (id: number) => {
    if (subEvents.length > 1) {
      setSubEvents(subEvents.filter((event) => event.id !== id));
    }
  };

  const updateSubEventData = (
    id: number,
    field: string,
    value: Date | null,
  ) => {
    setSubEvents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          updatedItem.isValid = updatedItem.endDate >= updatedItem.startDate;

          return updatedItem;
        }
        return item;
      }),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Sub Events ({subEvents.length}/5)
        </h3>
        {subEvents.length < 5 && (
          <Button className="cursor-pointer" size="xs" onClick={addSubEvent}>
            <HiPlus className="mr-2 h-4 w-4" /> Add Sub Event
          </Button>
        )}
      </div>

      {subEvents.map((event, index) => (
        <div
          key={event.id}
          className="relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          {subEvents.length > 1 && (
            <button
              type="button"
              onClick={() => removeSubEvent(event.id)}
              className="absolute -top-3 -right-3 rounded-full bg-red-100 p-2 text-red-600 shadow-sm transition-colors hover:bg-red-200"
            >
              <HiTrash size={18} />
            </button>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex flex-col flex-wrap-reverse gap-5 lg:flex-row">
              <div className="min-w-63.5 grow lg:order-3 xl:order-1">
                <div className="mb-2 block">
                  <Label htmlFor={`title-${index}`}>Sub Event Title</Label>
                </div>
                <TextInput
                  id={`title-${index}`}
                  name={`subEvents[${index}][title]`}
                  placeholder="e.g., Morning Workshop"
                  required={true}
                  type="text"
                  defaultValue={event.title}
                />
              </div>

              <div className="min-w-63.5 grow lg:order-1 xl:order-2">
                <div className="mb-2 block">
                  <Label color={!event.isValid ? "failure" : undefined}>
                    Starting Date
                  </Label>
                </div>
                <CustomizedDatepicker
                  initialGivenDate={event.startDate}
                  setDateHandler={(date) =>
                    updateSubEventData(event.id, "startDate", date)
                  }
                  name={`subEvents[${index}][startDate]`}
                  required={true}
                />
              </div>

              <div className="min-w-63.5 grow lg:order-2 xl:order-3">
                <div className="mb-2 block">
                  <Label color={!event.isValid ? "failure" : undefined}>
                    Ending Date
                  </Label>
                </div>
                <CustomizedDatepicker
                  initialGivenDate={event.endDate}
                  setDateHandler={(date) =>
                    updateSubEventData(event.id, "endDate", date)
                  }
                  name={`subEvents[${index}][endDate]`}
                  required={true}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor={`desc-${index}`}>Description</Label>
              </div>
              <Textarea
                id={`desc-${index}`}
                name={`subEvents[${index}][description]`}
                placeholder="Details about this specific session..."
                required={true}
                rows={3}
                defaultValue={event.description}
                className="min-h-30"
              />
            </div>
            {!event.isValid && (
              <HelperText color="failure" className="text-center">
                starting date must be before ending date.
              </HelperText>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
