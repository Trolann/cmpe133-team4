import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import Settings from './screens/Settings';
import MainSwiping from './screens/MainSwiping';

const Stack = createNativeStackNavigator();

//Web: 589522506874-42sut51em6v6n4li0n3c58ngee9q87sv.apps.googleusercontent.com
//IOS:589522506874-c42r9t7p05ggtr49h84m56gam891000b.apps.googleusercontent.com
//Android:
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Swiping" component={MainSwiping} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
