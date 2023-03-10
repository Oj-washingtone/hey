import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function JoinChamaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Join Chama Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
