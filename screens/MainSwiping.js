import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Alert, ImageBackground } from 'react-native';
import TopBar from '../components/TopBar';
import Swipes from '../components/Swipes';
import BottomBar from '../components/BottomBar';
import Results from './Results';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getResults, likeRestaraunt } from '../services/api';

const MainSwiping = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipesRef = useRef(null);

  const route = useRoute();
  const { AccessToken, Location, user_id, session_id, sessionTime } = route.params;
  const [sessionData, setSessionData] = useState([]);
  const [endTime, setEndTime] = useState(9999);
  if(sessionTime > 0 ){
    var sessionLength = sessionTime;
  }

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        var access_token = AccessToken;
        const data = await getResults(user_id, access_token, session_id);
        setPlaces(data.google_results);
        setSessionData(data);
        checkTime();
        console.log(sessionTime);
      } catch (error) {
        console.log(error);
        Alert.alert('Error getting places', '', [{ text: 'Retry', onPress: fetchPlaces }]);
      }
    };

    fetchPlaces();
  }, []);

  const checkTime = () => {
    if((new Date().getTime()/1000) > (sessionData.timer + sessionLength)){
    
      console.log("Current Time: " , new Date().getTime()/1000);
      console.log("Start Time: ", sessionData.timer);
      console.log("Session Length: ", sessionLength)
      console.log('stop');
      navigation.navigate ("Results", {AccessToken: AccessToken, session_id: session_id, user_id: user_id,});
      // Get final results 
    }
  }

  const handleLike = async () => {
    var restaurant = places[currentIndex].name;
    console.log('Restaurant ', currentIndex, ': Restaurant Name: ', restaurant);
    try {
      const likeVerif = await 
      likeRestaraunt(user_id, access_token, restaurant);
      console.log("LikeVerif: ", likeVerif);
      if (likeVerif) {
        //Loader?
        //const updated = await getResults(user_id, access_token, session_id);
        if (updated) {
          console.log("Like Successful: Session Updated");
          //checkTime();
          nextPlace();
        }
      }
    } catch (error) {
      console.log(error);
      //Alert.alert('Like Failed: Error Updating Session');
    }

  };

  const handlePass = () => {
    console.log('pass');
    checkTime();
    nextPlace();
  };

  const nextPlace = () => {
    const nextIndex = currentIndex === places.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  const handleLikePress = () => {
    swipesRef.current.openLeft();
  };

  const handlePassPress = () => {
    swipesRef.current.openRight();
  };

  return (
    
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <TopBar />
        <View style={styles.swipes}>
          {places.length > 0 && (
            <Swipes
              ref={swipesRef}
              currentIndex={currentIndex}
              places={places}
              handleLike={handleLike}
              handlePass={handlePass}
            />
          )}
        </View>
        <BottomBar handleLikePress={handleLikePress} handlePassPress={handlePassPress} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  timer:{
    flex: 1,
  },
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
  },
  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

export default MainSwiping;
