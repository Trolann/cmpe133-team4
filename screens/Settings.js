import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocationPreference] = useState(false);

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const toggleLocation = () => {
    setLocationPreference(!location);
  };

  const saveSettings = () => {
    // Implement your logic to save the settings here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Receive Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Enable Location</Text>
        <Switch
          value={location}
          onValueChange={toggleLocation}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSettings}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SettingsScreen;
