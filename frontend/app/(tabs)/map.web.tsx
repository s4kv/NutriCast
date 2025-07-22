import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

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

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE"; // ommitting in the pr for obvious reasons

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

export default function MapWeb() {
  const { location: userLocation, loading, error } = useUserLocation();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Fetch nearby restaurants from backend
  useEffect(() => {
    if (userLocation) {
      fetch("http://localhost:8080/api/restaurants/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: 1500, // meters
        }),
      })
        .then((res) => res.json())
        .then((data) => setRestaurants(data));
    }
  }, [userLocation]);

  if (!isLoaded || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!userLocation) return <div>Getting location...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      }}
      zoom={14}
    >
      //user marker
      <Marker
        position={{
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        }}
        label="You"
      />

      // restaurant markers
      {restaurants.map((r) => (
        <Marker
          key={r.name}
          position={{ lat: r.latitude, lng: r.longitude }}
          onClick={() => setSelectedRestaurant(r)}
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
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}