import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, ImageBackground } from 'react-native';
import TopBar from '../components/TopBar';
import Swipes from '../components/Swipes';
import BottomBar from '../components/BottomBar';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getResults } from '../services/api';

const MainSwiping = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipesRef = useRef(null);

  const route = useRoute();
  const { AccessToken, Location, user_id, session_id } = route.params;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        var access_token = AccessToken;
        console.log("ID at Swipe: ", user_id);
        const { data } = await getResults(user_id, access_token, session_id);
        setUsers(data.results);
      } catch (error) {
        console.log(error);
        Alert.alert('Error getting users', '', [{ text: 'Retry', onPress: fetchUsers }]);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = () => {
    console.log('like');
    nextUser();
  };

  const handlePass = () => {
    console.log('pass');
    nextUser();
  };

  const nextUser = () => {
    const nextIndex = currentIndex === users.length - 1 ? 0 : currentIndex + 1;
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
          {users.length > 0 && (
            <Swipes
              ref={swipesRef}
              currentIndex={currentIndex}
              users={users}
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
