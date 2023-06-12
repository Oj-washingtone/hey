import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { MaterialCommunityIcons } from "react-native-vector-icons";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logoWrapper}>
        {/* Icon */}
        <MaterialCommunityIcons
          name="all-inclusive"
          size={40}
          color="#ed4746"
        />
        <Text style={styles.logo}>ChamaPal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  logoWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
});

export default SplashScreen;
