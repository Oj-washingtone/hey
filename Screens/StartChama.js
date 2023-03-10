import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function StartChamaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Start Chama Screen</Text>
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
