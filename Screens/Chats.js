import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";

export default function Chats() {
  return (
    <View style={styles.container}>
      <Text>Chats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
