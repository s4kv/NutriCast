import React, { useState, useEffect } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUserLocation } from '../hooks/useUserLocation';
import * as dotenv from 'dotenv';

type Restaurant = {
  id: string;
  properties: { name: string; cuisine: string; price?: string; };
  geometry: { coordinates: number[][]; };
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLatc = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLatc / 2) * Math.sin(dLatc / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const UserMarker = () => <div className="user-marker" />;
const RestaurantMarker = () => <div className="restaurant-marker" />;

export default function MapPage() {
  const { location: userLocation, loading, error } = useUserLocation();
  const [viewState, setViewState] = useState({ latitude: 33.7490, longitude: -84.3880, zoom: 11 });
  const [stateName, setStateName] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [filter, setFilter] = useState<{ cuisine?: string; price?: string; radiusKm?: number }>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (userLocation) {
      setViewState(v => ({ ...v, latitude: userLocation.latitude, longitude: userLocation.longitude, zoom: 12 }));
    }
  }, [userLocation]);

  useEffect(() => {
    if (!userLocation) return;
    const { longitude, latitude } = userLocation;
    (async () => {
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_API_KEY}`);
        if (!res.ok) throw new Error('Geocoding API call failed');
        const data = await res.json();
        const stateFeature = data?.features?.find((f: any) => f.place_type.includes('region'));
        if (stateFeature) setStateName(stateFeature.text.toLowerCase());
      } catch(err) {
        console.error("Reverse geocoding error:", err);
      }
    })();
  }, [userLocation]);

  useEffect(() => {
    if (!stateName) return;
    (async () => {
      try {
        console.log(stateName)
        const res = await fetch(`http://localhost:8080/api/restaurants/by-state?state=${stateName}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setRestaurants(data);
        console.log(restaurants);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    })();
  }, [stateName]);

  useEffect(() => {
    if (!userLocation) return;
    const filtered = restaurants.filter((r) => {
      const coords = r?.geometry?.coordinates;

      if (!Array.isArray(coords) || coords.length === 0 || !Array.isArray(coords[0]) || coords[0].length < 2) {
        return false;
      }

      if (filter.cuisine && r.properties.cuisine !== filter.cuisine) return false;
      if (filter.price && r.properties.price !== filter.price) return false;
      if (filter.radiusKm) {
        const [lng, lat] = coords[0]; 
        const dist = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, lat, lng);
        if (dist > filter.radiusKm) return false;
      }
      return true;
    });
    setFilteredRestaurants(filtered);
  }, [filter, restaurants, userLocation]);

  if (loading) return <div>📍 Getting your location...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userLocation) return <div>Could not determine location.</div>;

  const handleFilterClick = () => setFilter({ cuisine: 'Italian', price: '$$', radiusKm: 5 });
  
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: 'white', padding: '5px' }}>
         <button onClick={handleFilterClick}>Apply Italian Filter (5km)</button>
      </div>
      <MapGL {...viewState} onMove={evt => setViewState(evt.viewState)} style={{ width: '100%', height: '100%' }} mapStyle="mapbox://styles/mapbox/streets-v11" mapboxAccessToken={process.env.EXPO_PUBLIC_MAPBOX_API_KEY}>
        <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
           <UserMarker />
        </Marker>
        {filteredRestaurants.map(restaurant => (
          <Marker 
            key={restaurant.id} 
            longitude={restaurant.geometry.coordinates[0][0]} 
            latitude={restaurant.geometry.coordinates[0][1]} 
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <RestaurantMarker />
          </Marker>
        ))}
        {selectedRestaurant && (
          <Popup 
            longitude={selectedRestaurant.geometry.coordinates[0][0]} 
            latitude={selectedRestaurant.geometry.coordinates[0][1]} 
            onClose={() => setSelectedRestaurant(null)} 
            anchor="top"
          >
            <div><h3>{selectedRestaurant.properties.name}</h3><p>{selectedRestaurant.properties.cuisine}</p></div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}