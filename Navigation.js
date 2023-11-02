import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      {/* Define your screens here */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Swiping" component={MainSwiping} />
      
    </Stack.Navigator>
  );
}

export default Navigation;