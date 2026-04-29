import React, { useRef, useState } from "react";
import { LocationPicker } from "./LocationPicker";
import { HelperText, Label, Textarea, TextInput } from "flowbite-react";
import CategorySelect from "./CategorySelect";

interface Ilocation {
  lat: number;
  lng: number;
  address: string;
}

export function MainEventForm({ initialData }: { initialData?: any }) {
  const [location, setLocation] = useState<[number, number]>(
    initialData ? [initialData.lat, initialData.lng] : [25, 30],
  );
  const [address, setAddress] = useState(initialData?.eventLocation || "");
  const selectedRef = useRef(null);
  const handleOnChangeLocationData = (loc: Ilocation) => {
    setLocation([loc.lat, loc.lng]);
    setAddress(loc.address);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="grow">
          <div className="mb-2 block">
            <Label htmlFor={`event-title`}>Event Title</Label>
          </div>
          <TextInput
            id={`event-title`}
            name={`eventTitle`}
            placeholder="e.g., Morning Workshop"
            required={true}
            type="text"
            defaultValue={initialData?.mainTitle}
          />
        </div>
        <div className="grow">
          <div className="mb-2 block">
            <label
              htmlFor="capacity"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              Event capacity
            </label>
          </div>
          <input
            type="number"
            name="capacity"
            id="capacity"
            min={1}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
            required
            defaultValue={initialData?.capacity}
          />
        </div>
        <CategorySelect
          selectedRef={selectedRef}
          initialSelection={initialData?.category?._id}
        ></CategorySelect>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="z-10 grow">
          <LocationPicker
            value={location}
            onChange={handleOnChangeLocationData}
          ></LocationPicker>
          <input
            type="number"
            readOnly
            hidden
            value={location[0]}
            name="lat"
            id="lat"
          />
          <input
            type="number"
            readOnly
            hidden
            value={location[1]}
            name="lng"
            id="lng"
          />
        </div>
        <div className="flex grow flex-col gap-5 lg:max-w-[49%]">
          <div>
            <div className="mb-2 block">
              <Label htmlFor={`event-location`}>Location</Label>
            </div>
            <TextInput
              value={address}
              name={`eventLocation`}
              id={`event-location`}
              placeholder="e.g., Morning Workshop"
              required={true}
              type="text"
              readOnly={true}
            />
            {!address && (
              <HelperText color="failure">
                please use the map to select location
              </HelperText>
            )}
          </div>
          <div className="flex grow flex-col">
            <div className="mb-2 block">
              <Label htmlFor={`location-desc`}>Description</Label>
            </div>
            <Textarea
              id={`location-desc`}
              name={`locationDescription`}
              placeholder="Extra details about the location..."
              rows={3}
              className="min-h-30 grow"
              defaultValue={initialData?.locationDescription}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
