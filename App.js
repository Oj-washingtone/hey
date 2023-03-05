import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// react navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import screens
import LoginScreen from "./Screens/Login";
import SignUpScreen from "./Screens/SignUp";

function Home({ navigation }) {
  const gotoLoginScreen = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Home trial</Text>
      <TouchableOpacity
        style={styles.loginBtn}
        activeOpacity={0.5}
        onPress={gotoLoginScreen}
      >
        <Text style={styles.BtnText}>Login</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  // change android navigation color
  NavigationBar.setBackgroundColorAsync("white");
  // change android navigation buttons color
  NavigationBar.setButtonStyleAsync("dark");

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sign up"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {
    width: "80%",
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 20,
    margin: 60,
  },
  BtnText: {
    color: "white",
    textAlign: "center",
  },
});
