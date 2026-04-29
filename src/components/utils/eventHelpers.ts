export const structureEventData = (
  rawData: Record<string, any>,
  images: string[],
) => {
  const structuredData: any = {
    mainTitle: rawData.eventTitle,
    capacity: Number(rawData.capacity),
    category: rawData.eventCategory,
    lat: Number(rawData.lat),
    lng: Number(rawData.lng),
    eventLocation: rawData.eventLocation,
    subEvents: [],
    locationDescription: rawData.locationDescription || undefined,
    eventImagesSrc: images,
  };

  Object.keys(rawData).forEach((key) => {
    const match = key.match(/subEvents\[(\d+)\]\[(\w+)\]/);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (!structuredData.subEvents[index])
        structuredData.subEvents[index] = {};
      structuredData.subEvents[index][field] = rawData[key];

      if (field === "startDate" || field === "endDate") {
        structuredData.subEvents[index][field] = new Date(
          rawData[key],
        ).toISOString();
      } else {
        structuredData.subEvents[index][field] = rawData[key];
      }
    }
  });

  return structuredData;
};
