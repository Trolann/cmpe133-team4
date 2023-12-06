import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Image, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import Carousel from 'react-native-snap-carousel';
import { getResults } from '../services/api';

const Results = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [places, setPlaces] = useState([]);
  const carouselRef = useRef(null);

  const route = useRoute();
  const { AccessToken, user_id, session_id } = route.params;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const access_token = AccessToken;
        const data = await getResults(user_id, access_token, session_id);

        const newPlaces = data.final_results.map(finalResult => {
          const match = data.google_results.find(
            googleResult => Object.keys(finalResult)[0] === googleResult.name
          );

          return match || null;
        });

        setPlaces(newPlaces.filter(place => place !== null));
      } catch (error) {
        console.log(error);
        Alert.alert('Error getting places');
      }
    };

    fetchPlaces();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.carouselItem} onPress={() => handleLinkPress(item)}>
      <Image style={styles.image} source={{ uri: item.photos[0] }} />
      <View style={styles.textContainer}>
        <Text style={[styles.restaurantName, styles.textShadow, { fontFamily: 'Montserrat_400Regular' }]}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleLinkPress = (item) => {
    const address = encodeURIComponent(item.formatted_address);
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${address}`;
  
    // Now you can use the link, for example, open it in a browser or use Linking in a React Native app
    console.log('Google Maps link:', googleMapsLink);
  
    // If you are in a React Native app, you can use Linking to open the link
    Linking.openURL(googleMapsLink);
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <Carousel
        ref={carouselRef}
        data={places}
        renderItem={renderItem}
        sliderWidth={510}
        itemWidth={400}
        onSnapToItem={index => setCurrentIndex(index)}
      />
      <Text style={styles.currentIndex}>{currentIndex + 1}/{places.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    alignSelf: 'center',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginTop: 20,
    marginBottom: 20,
  },
  textContainer: {
    position: 'absolute',
    width: 300,
    bottom: '15%',
    left: 50,
    right: 0,
    alignSelf: 'center',
  },
  restaurantName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 1,
    textAlign: 'center',
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.80)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 30,
  },
  image: {
    width: 350,
    height: 500,
    resizeMode: 'cover',
    borderRadius: 50,
    alignSelf: 'center',
  },
  currentIndex: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
  },
});

export default Results;