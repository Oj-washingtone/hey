import { StyleSheet, View, Text } from "react-native";

export default function WalletPage() {
  return (
    <View style={styles.container}>
      <Text>Wallet Screen</Text>
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
