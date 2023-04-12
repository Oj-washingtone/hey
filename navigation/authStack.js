/**
 * An authStack that includes all stacks for unauthenticated users
 */

// import navigation container and navigation stack
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import screens
import WelcomeScreen from "../Screens/WelcomeScreen";
import LoginScreen from "../Screens/Login";
import SignUpScreen from "../Screens/SignUp";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen
          name="Welcome Screen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: "",
            headerTitleStyle: { display: "none" },
          }}
        />
        <Stack.Screen
          name="Sign up"
          component={SignUpScreen}
          options={{
            headerTitle: "",
            headerTitleStyle: { display: "none" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
