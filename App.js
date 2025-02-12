import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to use the map.");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleLongPress = (event) => {
    const newMarker = event.nativeEvent.coordinate;
    setMarkers([...markers, newMarker]);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={location}
        showsUserLocation={true}
        zoomEnabled={true} // Allows pinch-to-zoom
        zoomControlEnabled={true} // Enables zoom buttons (Android only)
        onLongPress={handleLongPress}
        >
          {markers.map((marker, index) => (
            <Marker key={index} coordinate={marker} />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
