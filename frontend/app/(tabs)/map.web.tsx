import React, { useState, useEffect } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUserLocation } from '../hooks/useUserLocation';

const UserMarker = () => (
  <div style={{
    width: 20,
    height: 20,
    backgroundColor: '#1D4ED8',
    borderRadius: '50%',
    border: '2px solid white',
    cursor: 'pointer'
  }} />
);

const RestaurantMarker = () => (
  <div style={{
    width: 15,
    height: 15,
    backgroundColor: '#DC2626',
    borderRadius: '50%',
    border: '2px solid white',
    cursor: 'pointer'
  }} />
);

export default function MapPage() {
  const { location: userLocation, loading, error } = useUserLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 33.7490,
    longitude: -84.3880,
    zoom: 11,
  });

  useEffect(() => {
    if (userLocation) {
      setViewState(currentView => ({
        ...currentView,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: 12, 
      }));
      // TODO: Fetch restaurant data w/ given loc
    }
  }, [userLocation]);

  if (loading) {
    return <div>📍 Getting your location...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!userLocation) {
    return <div>Could not determine your location.</div>;
  }

  const mapProps = {
    ...viewState,
    onMove: evt => setViewState(evt.viewState),
    style:{ width: '100%', height: '100%' },
    mapStyle: "mapbox://styles/mapbox/streets-v11",
    mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY
  };

  return (
    <MapGL {...mapProps}>
      // user marker
      <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
        <UserMarker />
      </Marker>

      // restaurant marker
      {restaurants.map(restaurant => (
        <Marker
          key={restaurant.id}
          longitude={restaurant.geometry.coordinates[0]}
          latitude={restaurant.geometry.coordinates[1]}
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelectedRestaurant(restaurant);
          }}
        >
          <RestaurantMarker />
        </Marker>
      ))}

      // popup 
      {selectedRestaurant && (
        <Popup
          anchor="top"
          longitude={selectedRestaurant.geometry.coordinates[0]}
          latitude={selectedRestaurant.geometry.coordinates[1]}
          onClose={() => setSelectedRestaurant(null)}
          offset={15}
        >
          <div>
            <h3>{selectedRestaurant.properties.name}</h3>
            <p>Cuisine: {selectedRestaurant.properties.cuisine}</p>
            <p>Price: {selectedRestaurant.properties.price || 'N/A'}</p>
          </div>
        </Popup>
      )}
    </MapGL>
  );
}