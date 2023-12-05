import React, { useState, useEffect, useParams } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, FlatList } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { newSession } from '../services/api';
import { joinSession } from '../services/api';
import { Alert } from 'react-native';

const SessionPage = ({ navigation }) => {

  const route = useRoute();
  const { AccessToken, Location, user_id } = route.params;
  const [sessionID, setSessionID] = useState(global.session);
  var lat = -48.876667;
  var long = -123.393333
  var filter_distance = 10000;

  if(Location){
    lat = Location.latitude;
    long = Location.longitude;
  }

  const handleCreateNewSession = async() => {
    
    
    try {
      global.access_token = AccessToken;
      console.log('User Id: ', user_id);
      const session = await newSession(user_id, access_token, lat, long, filter_distance);
      global.sessionID = session;
      console.log('Global Session ID: ', session);
      if (session) {
        console.log("PreNav ID: ", user_id);
        navigation.navigate('Swiping', { AccessToken: AccessToken, session_id: session, user_id: user_id })
        setSessionID(session);
      }
    }
    catch (error) {
      console.error('Create new session failed', error.message);
      // handling errors
    }
  }
  // Navigate to the desired screen after creating a new session

  const handleJoinSession = async() => {
    try {
      global.access_token = AccessToken;
      const session = await joinSession(user_id, access_token, sessionID);
      global.sessionID = session;
      
      if (session) {
        navigation.navigate('Swiping', { AccessToken: AccessToken, session_id: session, user_id: user_id })
        setSessionID(session);
      }
    }
    catch (error) {
      console.error('Join session failed', error.message);
      Alert.alert(
      "Join Session Failed",
      error.message,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ]
      );
     }
   };


  const [sessionDetails, setSessionDetails] = useState({
    timer: 60,
    previousSessions: [
      { id: 1, name: 'Session 1', restaurants: [] },
      // Add more previous sessions as needed
    ],
  });

  const [selectedSessions, setSelectedSessions] = useState([]); // Track selected sessions

  const [timerInterval, setTimerInterval] = useState(null);

  const updateTimer = (increment) => {
    setSessionDetails((prevDetails) => ({
      ...prevDetails,
      timer: prevDetails.timer + increment,
    }));
  };

  const startTimer = () => {
    setTimerInterval(
      setInterval(() => {
        setSessionDetails((prevDetails) => ({
          ...prevDetails,
          timer: prevDetails.timer - 1,
        }));
      }, 1000)
    );
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };



  
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);


  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView>
        {/* Create Session Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Create Session</Text>

          {/* Select Location Button */}
          <TouchableOpacity
            style={styles.selectLocationButton}
            onPress={() => navigation.navigate('ChooseLocation', { AccessToken: AccessToken, radius: 5, user_id: user_id })} // sessionId?
          >
            <Text style={styles.buttonText}>Select Location</Text>
          </TouchableOpacity>

          {/* Create Session Button */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNewSession}>
            <Text style={styles.buttonText}>Create Session</Text>
          </TouchableOpacity>
        </View>

        {/* OR Separator */}
        <View style={styles.separator} />

        {/* Join Previous Sessions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Join Session</Text>
          <Text style={styles.label}>Session ID</Text>
          
            
          <TextInput
            style={styles.input}
            placeholder="Session ID"
            defaultValue={String(sessionID) === 'undefined' ? 'Enter SessionID Number' : String(sessionID)}
            
          />

          

          
          

          {/* Join Session Button */}
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinSession}>
            <Text style={styles.buttonText}>Join Session</Text>
          </TouchableOpacity>
        </View>

        {/* Timer Section */}
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Timer</Text>
          <Text style={styles.timerText}>
            {`${Math.floor(sessionDetails.timer / 60)}:${(sessionDetails.timer % 60)
              .toString()
              .padStart(2, '0')}`}
          </Text>
          <View style={styles.timerButtons}>
            <TouchableOpacity style={styles.touchableButton} onPress={() => updateTimer(30)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableButton} onPress={() => updateTimer(-30)}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableButton} onPress={startTimer}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableButton} onPress={stopTimer}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF0000',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  inviteFriendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteInput: {
    flex: 1,
    height: 40,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectLocationButton: {
    backgroundColor: '#FF0000',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 2,
    backgroundColor: '#E8E8E8',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  sessionList: {
    height: 50,
    marginBottom: 10,
  },
  sessionItem: {
    fontSize: 16,
    marginBottom: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
  },
  selectedSessionItem: {
    backgroundColor: '#FF0000',
  },
  timerText: {
    fontSize: 24,
    marginBottom: 5,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  touchableButton: {
    backgroundColor: '#FF0000',
    padding: 24,
    borderRadius: 15,
    alignItems: 'center',
  },
});

export default SessionPage;
