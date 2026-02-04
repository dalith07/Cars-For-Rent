"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapCompany = {
    name: string;
    lat: number;
    lng: number;
};

export default function MapSection({ companies }: { companies: MapCompany[] }) {
    const mapCenter: L.LatLngTuple =
        companies.length > 0
            ? [companies[0].lat, companies[0].lng]
            : [36.81897, 10.16579]; // Tunis default

    const icon = L.divIcon({
        className: "google-marker",
        html: `
    <div class="gm-pin">
      <div class="gm-pin-inner"></div>
    </div>
  `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -38],
    });

    return (
        <div className="mt-20 w-full h-[400px] rounded-2xl overflow-hidden">
            <MapContainer center={mapCenter} zoom={12} className="w-full h-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {companies.map((c, i) => (
                    <Marker key={i} position={[c.lat, c.lng]} icon={icon}>
                        <Popup>
                            <strong>{c.name}</strong>
                            <br />
                            Lat: {c.lat}
                            <br />
                            Lng: {c.lng}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
