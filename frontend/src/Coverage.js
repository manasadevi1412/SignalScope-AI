import React, { useState } from "react";
import axios from "axios";
import MapView from "./MapView";
import coverageBg from "./assets/coverage-bg.jpg";

function Coverage() {
  const [location, setLocation] = useState("");
  const [network, setNetwork] = useState("Jio");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapPoints, setMapPoints] = useState([]);
  const [mapCenter, setMapCenter] = useState([17.98, 79.59]);

  // 🔥 Realistic telecom distribution
  const generateMapPoints = (baseLat, baseLng) => {
    const levels = ["Excellent", "Good", "Poor"];
    let points = [];

    for (let i = 0; i < 25; i++) {
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;

      const distance = Math.sqrt(latOffset ** 2 + lngOffset ** 2);

      let strength;
      let dbm;

      if (distance < 0.005) {
        strength = "Excellent";
        dbm = -65 - Math.floor(Math.random() * 5);
      } else if (distance < 0.01) {
        strength = "Good";
        dbm = -75 - Math.floor(Math.random() * 5);
      } else {
        strength = "Poor";
        dbm = -90 - Math.floor(Math.random() * 5);
      }

      points.push({
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        strength,
        dbm,
        network
      });
    }

    return points;
  };
  const getCoordinates = async (place) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );

    if (response.data.length > 0) {
      const lat = parseFloat(response.data[0].lat);
      const lon = parseFloat(response.data[0].lon);
      return [lat, lon];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

  // 🔥 Analyze Signal
  const analyzeSignal = async () => {
  if (!location) return;

  setLoading(true);
  setResult(null);

  try {
    const response = await axios.post(
  "https://signalscope-ai.onrender.com/api/predict-signal",
  { location, network }
);

    setResult(response.data);

    // 🔥 Get REAL coordinates
    const coords = await getCoordinates(location);

    if (coords) {
      const [lat, lng] = coords;

      setMapCenter([lat, lng]);
      setMapPoints(generateMapPoints(lat, lng));
      setShowMap(true);
    } else {
      alert("Location not found");
    }

  } catch (error) {
    console.error(error);
    setResult({ error: "Prediction failed" });
  }

  setLoading(false);
};

  // 🔥 Current Location Feature
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setMapCenter([lat, lng]);
        setMapPoints(generateMapPoints(lat, lng));
        setShowMap(true);
        setLocation("Current Location");
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div
      className="coverage"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${coverageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h2>Signal Coverage</h2>

      <input
  type="text"
  placeholder="Enter city / area / country"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      analyzeSignal();
    }
  }}
/>

      <select
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
      >
        <option>Jio</option>
        <option>Airtel</option>
        <option>BSNL</option>
        <option>Idea</option>
      </select>

      <button onClick={analyzeSignal}>
        Analyze Signal
      </button>

      <button onClick={handleCurrentLocation}>
        Use Current Location
      </button>

      <button onClick={() => setShowMap(!showMap)}>
        {showMap ? "Hide Map" : "Look in Map"}
      </button>

      {loading && (
        <div className="loading">
          Analyzing<span>.</span><span>.</span><span>.</span>
        </div>
      )}

      {result && !result.error && (
        <div
          className={`result ${
            result.signal === "Excellent"
              ? "green"
              : result.signal === "Good"
              ? "orange"
              : "red"
          }`}
        >
          <p><strong>Location:</strong> {result.location}</p>
          <p><strong>Network:</strong> {result.network}</p>
          <p><strong>Signal:</strong> {result.signal}</p>
          <p><strong>Strength:</strong> {result.strength} dBm</p>
        </div>
      )}

      {result && result.error && (
        <div className="result red">
          {result.error}
        </div>
      )}

      {showMap && (
        <MapView
  key={mapCenter.toString()}   // 🔥 force re-render
  points={mapPoints}
  center={mapCenter}
/>
      )}

      <div className="footer">
        SignalX © 2026 · Network Signal Visualization Platform
      </div>
    </div>
  );
}

export default Coverage;
