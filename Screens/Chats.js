import { StyleSheet, View, Text } from "react-native";

export default function Chats() {
  return (
    <View style={styles.container}>
      <Text>Direct Chats</Text>
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
