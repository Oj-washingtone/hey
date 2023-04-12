import { StatusBar } from "expo-status-bar";

import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";


export default function WelcomeScreen({ navigation }) {
  const gotoLoginScreen = () => {
    navigation.navigate("Login");
  };

  const caroselData = [
    {
      title: "Powering modern chamas",
      description:
        "Brighter is a mobile app that helps you manage your chama with ease",
    },
    {
      title: "Powering modern chamas",
      description:
        "Brighter is a mobile app that helps you manage your chama with ease",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logoWrapper}>
        {/* Icon */}
        <MaterialCommunityIcons
          name="lightning-bolt-circle"
          size={40}
          color="black"
        />
        <Text style={styles.logo}>brighter</Text>
      </View>

      <Image
        source={require("./../assets/bg_intro.png")}
        style={styles.onboardingImage}
      />
      <View style={styles.onboarding}>
        <Text style={styles.introText1}>We're powering modern chamas</Text>
        <Text style={styles.introText2}>
          Brighter helps you do your chama and table banking online in an easy,
          fast and secure manner.
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btn}
          onPress={gotoLoginScreen}
          activeOpacity={0.5}
        >
          <LinearGradient
            colors={["#ed4746", "#A353BB"]}
            start={[0.1, 0.1]}
            end={[1, 1]}
            style={styles.btnBackground}
          >
            <Text style={styles.btnText}>Get started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoWrapper: {
    width: "100%",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    verticalAlign: "middle",
  },

  onboardingImage: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },

  onboarding: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  introText1: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  introText2: {
    fontSize: 15,
    textAlign: "center",
    marginHorizontal: 50,
  },

  actions: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  btn: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBackground: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
