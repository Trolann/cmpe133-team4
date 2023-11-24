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
      <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
      <Stack.Screen name="ChooseProfilePicture" component={ChooseProfilePicture} />
      <Stack.Screen name="ChangeName" component={ChangeName} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Sessions" component={Sessions} />
    </Stack.Navigator>
  );
}

export default Navigation;