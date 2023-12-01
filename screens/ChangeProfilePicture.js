import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadPicture } from '../services/api';
import { api } from '../services/api';

const ChangeProfilePicture = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image_encoded', profilePicture);
    formData.append('user_id', 'your_user_id');
    formData.append('access_token', 'your_access_token');
    
    try {
      const response = await uploadPicture('your_user_id', 'your_access_token', profilePicture);
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
   };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
   
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
   };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Profile Picture</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.uploadText}>Upload Profile Picture</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Maintain a square aspect ratio
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 18,
    color: '#555555',
  },
  uploadButton: {
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

export default ChangeProfilePicture;
