import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function WithdrawFromWallet() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Withdraw from wallet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
