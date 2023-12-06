import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import Settings from './screens/Settings';
import MainSwiping from './screens/MainSwiping';
import ChooseLocation from './screens/ChooseLocation';
import ChangeProfilePicture from './screens/ChangeProfilePicture';
import ChangeName from './screens/ChangeName';
import Results from './screens/Results';
import ChangePassword from './screens/ChangePassword';
import Sessions from './screens/Sessions';
import TopBar from './components/TopBar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Swiping" component={MainSwiping} />
          <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
          <Stack.Screen name="ChangeProfilePicture" component={ChangeProfilePicture} />
          <Stack.Screen name="ChangeName" component={ChangeName} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="Sessions" component={Sessions} />
        </Stack.Navigator>
      </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
