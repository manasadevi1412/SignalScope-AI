import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// 🔥 Component to move map when center changes
function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13, {
      animate: true,
    });
  }, [center, map]);

  return null;
}

function MapView({ points = [], center }) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "15px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔥 This makes map move */}
      <ChangeMapView center={center} />

      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point.lat, point.lng]}
          radius={8}
          pathOptions={{
            color:
              point.strength === "Excellent"
                ? "green"
                : point.strength === "Good"
                ? "orange"
                : "red",
            fillOpacity: 0.7,
          }}
        >
          <Popup>
            <strong>{point.network}</strong>
            <br />
            Signal: {point.strength}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default MapView;