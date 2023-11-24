import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, FlatList } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SessionPage = ({ navigation }) => {
  const handleCreateNewSession = () => {
    // Implement logic to createNewSession
    // Navigate to the desired screen after creating a new session
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

  const handleSessionClick = (sessionId) => {
    // Toggle the selection of the session
    setSelectedSessions((prevSelected) => {
      if (prevSelected.includes(sessionId)) {
        // Deselect the session
        return prevSelected.filter((id) => id !== sessionId);
      } else {
        // Select the session
        return [...prevSelected, sessionId];
      }
    });
  };

  const handleJoinSession = () => {
    // Handle joining the selected sessions
    if (selectedSessions.length > 0) {
      // Implement logic to join the selected sessions
      console.log(`Joining sessions: ${selectedSessions.join(', ')}`);
    }
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

          {/* Session Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Session Name</Text>
            <TextInput style={styles.input} placeholder="Enter session name" />
          </View>

          {/* Select Location Button */}
          <TouchableOpacity
            style={styles.selectLocationButton}
            onPress={() => navigation.navigate('ChooseLocation', { sessionId: 5 })}
          >
            <Text style={styles.buttonText}>Select Location</Text>
          </TouchableOpacity>

          {/* Invite Friends Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Invite Friends</Text>
            <View style={styles.inviteFriendsContainer}>
              <TextInput style={styles.inviteInput} placeholder="Enter friend's Binge tag" />
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Session Button */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNewSession}>
            <Text style={styles.buttonText}>Create Session</Text>
          </TouchableOpacity>
        </View>

        {/* OR Separator */}
        <View style={styles.separator} />

        {/* Join Previous Sessions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Join Previous Sessions</Text>

          {/* Search Bar */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Search</Text>
            <TextInput style={styles.input} placeholder="Search sessions" />
          </View>

          {/* Session List */}
          <ScrollView style={styles.sessionList}>
            {sessionDetails.previousSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.sessionItem,
                  selectedSessions.includes(session.id) && styles.selectedSessionItem,
                ]}
                onPress={() => handleSessionClick(session.id)}
              >
                <Text>{session.name}</Text>
              </TouchableOpacity>
              // Display other session details or actions
            ))}
          </ScrollView>

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
