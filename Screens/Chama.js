import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

// import

export default function Chama({ navigation, route }) {
  const [chamaDetails, setChamaDetails] = useState(route.params.chamaDetails);
  console.log(chamaDetails);

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
