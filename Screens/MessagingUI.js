import { StyleSheet, View, Text } from "react-native";

export default function MessagingUI({ navigation, route }) {
  const chamaDetails = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.messageOwner}>
        Messages for {chamaDetails.chamaName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  messageOwner: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
