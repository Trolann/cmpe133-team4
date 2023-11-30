import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Svg, { Circle, Rect } from 'react-native-svg';

const ChooseLocationScreen = ({ navigation, route }) => {
  const {AccessToken, radius} = route.params;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const circleRadius = radius;

  useEffect(() => {
    
    // Fetch the user's current location when the component mounts
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const handleMapPress = event => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleUseMyLocation = () => {
    if (userLocation) {
      setSelectedLocation(userLocation);
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    // Clear the selected location so that only one marker is displayed
    setSelectedLocation(null);
  };

  const handleSaveLocation = () => {
    console.log('Selected Location:', selectedLocation);
    // Implement logic to save the selectedLocation
    navigation.navigate('Sessions', {AccessToken: AccessToken, Location: selectedLocation});
  };

  const mapRef = React.createRef();
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.3361,
          longitude: -121.8819,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {selectedLocation && (
          <React.Fragment>
          <Marker coordinate={selectedLocation} title="Selected Location" />
          {circleRadius && (
            <Circle
              center={selectedLocation}
              radius={circleRadius}
              fillColor="rgba(255, 0, 0, 0.3)"
              strokeColor="rgba(255, 0, 0, 0.5)"
              strokeWidth={300}
            />
          )}
        </React.Fragment>
        )}
      </MapView>

      <TouchableOpacity
        style={[styles.locationButton, { top: 20, left: 20 }]}
        onPress={handleUseMyLocation}
      >
        <Text style={styles.buttonText}>Use My Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.locationButton, { bottom: 20, left: 20 }]}
        onPress={handleSaveLocation}
      >
        <Text style={styles.buttonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ChooseLocationScreen;