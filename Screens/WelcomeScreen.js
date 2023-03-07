import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  const gotoLoginScreen = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Welcome Screen</Text>
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
