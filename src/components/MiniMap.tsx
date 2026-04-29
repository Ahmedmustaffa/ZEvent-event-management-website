"use client";
import { renderToString } from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";

const iconHTML = renderToString(<FaMapMarkerAlt size={30} color="red" />);

const customIcon = L.divIcon({
  html: iconHTML,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [12, 25],
});

export default function MiniMap({ pos }: { pos: [number, number] }) {
  return (
    <MapContainer
      className="min-h-50"
      center={pos}
      zoom={15}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos} icon={customIcon} />
    </MapContainer>
  );
}
