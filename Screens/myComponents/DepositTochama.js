import * as NavigationBar from "expo-navigation-bar";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

// import icons from react-native-vector-icons
import Ioicons from "react-native-vector-icons/Ionicons";

import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";

export default function ChamaDepositForm(props) {
  const [amount, setAmount] = useState(null);
  return (
    <View style={styles.depositForm}>
      <Text>Deposit to chama</Text>
      <TextInput
        value={amount}
        placeholder="Amount in (KES)"
        keyboardType="numeric"
        style={styles.amount}
        onChangeText={(text) => setAmount(text)}
        cursorColor="#ed4746"
      />
      <TouchableOpacity style={styles.sendButton} activeOpacity={0.5}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  depositForm: {
    backgroundColor: "white",
    padding: 10,
    width: "100%",
  },

  amount: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  sendButton: {
    backgroundColor: "#2e64e5",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  sendButtonText: {
    color: "#fff",
  },
});
