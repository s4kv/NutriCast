
import React, { useState, useEffect} from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps'
//import useLocation from './UseLocation'; // custom hook
//import FilterModal from './FilterModal'; // custom hook
import * as dotenv from 'dotenv';
import * as Location from 'expo-location';

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
    (async () => {
      const res = await fetch(`http://localhost:8080/api/restaurants/by-state?state=${stateName}`);
      const data = await res.json();
      setRestaurants(data);
    })();
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

  /*
  const styles  = StyleSheet.create({
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  });

 return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView style={{ flex: 1 }}>
        {userLocation && (
          <MapboxGL.Camera zoomLevel={12} centerCoordinate={userLocation} />
        )}
        {userLocation && (
          <MapboxGL.PointAnnotation id="user-location" coordinate={userLocation}>
            <View style={{ backgroundColor: 'blue', borderRadius: 10, width: 20, height: 20 }} />
          </MapboxGL.PointAnnotation>
        )}
        {filteredRestaurants.map((restaurant) => (
          <MapboxGL.PointAnnotation
            key={restaurant.id}
            id={restaurant.id}
            coordinate={restaurant.geometry.coordinates as [number, number]}
            onSelected={() => setSelectedRestaurant(restaurant)}
          >
            <View style={{ backgroundColor: 'red', borderRadius: 10, width: 20, height: 20 }} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      <Button title="Filter" onPress={handleFilter} />
      <Modal visible={!!selectedRestaurant} transparent>
        <View style={styles.modalContainer}>
          <Text>{selectedRestaurant?.properties.name}</Text>
          <Text>{selectedRestaurant?.properties.cuisine}</Text>
          <Text>{selectedRestaurant?.properties.price}</Text>
          <Button title="Close" onPress={() => setSelectedRestaurant(null)} />
        </View>
      </Modal>
    </View>
  );
*/
}