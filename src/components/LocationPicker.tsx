"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToString } from "react-dom/server";

const iconHTML = renderToString(<FaMapMarkerAlt size={30} color="red" />);

const customIcon = L.divIcon({
  html: iconHTML,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [12, 25],
});

interface Ilocation {
  lat: number;
  lng: number;
  address: string;
}

function ClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (loc: Ilocation) => void;
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      // Reverse geocode with Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      );
      const data = await res.json();
      onLocationSelect({
        lat,
        lng,
        address: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      });
    },
  });
  return null;
}

export function LocationPicker({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: Function;
}) {
  const [marker, setMarker] = useState(value ? [value[0], value[1]] : null);

  const handleSelect = (loc: Ilocation) => {
    setMarker([loc.lat, loc.lng]);
    onChange(loc);
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        //@ts-ignore
        center={marker || [20, 0]}
        zoom={marker ? 13 : 2}
        style={{
          minHeight: "350px",
          height: "100%",
          width: "100%",
          borderRadius: 8,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onLocationSelect={handleSelect} />

        {marker && (
          //@ts-ignore
          <Marker position={marker} icon={customIcon} />
        )}
      </MapContainer>
    </div>
  );
}
