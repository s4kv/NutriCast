import React, { useState, useEffect} from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps'
//import useLocation from './UseLocation'; // custom hook
//import FilterModal from './FilterModal'; // custom hook
import * as dotenv from 'dotenv';
import * as Location from 'expo-location';
import backend from "../../services/backend"; 
MapboxGL.setAccessToken(process.env.MAPBOX_API_KEY);

type Restaurant = {
  id: string;
  properties: {
    name: string;
    cuisine: string;
    price?: string;
    // ...other fields
  };
  geometry: {
    coordinates: [number, number];
  };
};


export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [stateName, setStateName] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [filter, setFilter] = useState<{ cuisine?: string; price?: string; radiusKm?: number }>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation([location.coords.longitude, location.coords.latitude]);
    })();
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    (async () => {
      const [lng, lat] = userLocation;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_API_KEY}`
      );
      const data = await res.json();
      const stateFeature = data.features.find((f: any) =>
        f.place_type.includes('region')
      );
      if (stateFeature) {
        setStateName((stateFeature.text).toLowerCase());
      }
    })();
  }, [userLocation]);

  // get restaurants
  useEffect(() => {
    if (!stateName) return;
    backend.get(`/api/restaurants/by-state`, {
      params: { state: stateName }
    })
    .then((res) => {
      setRestaurants(Array.isArray(res.data) ? res.data : []);
    })
    .catch((error) => {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
    });
  }, [stateName]);

    useEffect(() => {
    if (!userLocation) return;
    let filtered = restaurants.filter((r) => {
      if (filter.cuisine && r.properties.cuisine !== filter.cuisine) return false;
      if (filter.price && r.properties.price !== filter.price) return false;
      if (filter.radiusKm) {
        const [lng, lat] = r.geometry.coordinates;
        const dist = getDistanceFromLatLonInKm(userLocation[1], userLocation[0], lat, lng);
        if (dist > filter.radiusKm) return false;
      }
      return true;
    });
    setFilteredRestaurants(filtered);
  }, [filter, restaurants, userLocation]);

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  const handleFilter = () => {
    setFilter({ cuisine: 'Italian', price: '$$', radiusKm: 5 });
  };

}