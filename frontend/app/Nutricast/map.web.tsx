import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import backend from "../../services/backend";
import * as dotenv from 'dotenv';


const useUserLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
  }, []);

  return { location, loading, error };
};

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY; 

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const PLACE_TYPES = [
  "restaurant",
  "cafe",
  "meal_takeaway",
  "meal_delivery",
  "bar",
  "bakery",
  "food"
];

export default function MapWeb() {
  const { location: userLocation, loading, error } = useUserLocation();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [radius, setRadius] = useState(10); // miles

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (userLocation) {
      backend.post("/api/restaurants/nearby", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: Math.round(radius * 1609.34),
        types: selectedTypes,
      })
      .then((res) => {
        setRestaurants(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      });
    }
  }, [userLocation, radius, selectedTypes]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  if (!isLoaded || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!userLocation) return <div>Getting location...</div>;

  return (
    <div>
      // filter
      <div style={{ position: "absolute", zIndex: 1, background: "white", padding: 10, borderRadius: 8, left: 10, top: 10 }}>
        <div>
          <strong>Filter by Type:</strong>
          {PLACE_TYPES.map((type) => (
            <label key={type} style={{ marginLeft: 8 }}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Radius: </strong>
          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
          <span style={{ marginLeft: 8 }}>{radius} miles</span>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        }}
        zoom={14}
      >
        // user marker
        <Marker
          position={{
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          }}
          label="You"
          icon={{
            path:
              "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1.5,
          }}
        />
        
        // restaurant markers
        {restaurants.map((r) => (
          <Marker
            key={r.name + r.latitude + r.longitude}
            position={{ lat: r.latitude, lng: r.longitude }}
            onClick={() => setSelectedRestaurant(r)}
            icon={{
              path:
                "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
              fillColor: "#EA4335",
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 1.5,
            }}
          />
        ))}

        {selectedRestaurant && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.latitude,
              lng: selectedRestaurant.longitude,
            }}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <div>
              <h3>{selectedRestaurant.name}</h3>
              {selectedRestaurant.types && (
                <div>Types: {selectedRestaurant.types.join(", ")}</div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}