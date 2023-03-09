import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  const gotoLoginScreen = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.onboarding}>
        <Text>Welcome Screen</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn]}
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.signupBtn]}
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Sign up")}
        >
          <Text style={styles.signupBtnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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

  onboarding: {
    height: "80%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },

  btn: {
    width: "25%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 7,
    borderRadius: 20,
    alignItems: "center",
  },

  signupBtn: {
    backgroundColor: "#4fb448",
    borderColor: "#4fb448",
  },

  signupBtnText: {
    color: "white",
  },
});
