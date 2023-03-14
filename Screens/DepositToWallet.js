import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function DepositToWallet() {
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMpesaRequest = () => {
    setLoading(true);
    // send request to server
    // setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>DepositToWallet</Text> */}
      <View style={styles.depositAmountSection}>
        <Text style={styles.quiz}>
          How much would you wish to deposit to your wallet ?
        </Text>
        <TextInput
          style={styles.input}
          keyboardType={"number-pad"}
          autoFocus={true}
          cursorColor={"#bd0832"}
          placeholder="0.00"
          onChangeText={(amount) => setAmount(amount)}
        >
          {amount}
        </TextInput>
      </View>

      <TouchableOpacity
        style={styles.depositBtn}
        activeOpacity={0.5}
        onPress={sendMpesaRequest}
      >
        {loading && <ActivityIndicator size="small" color="#fff" />}
        <Text style={styles.depositBtnText}>
          {loading ? "Waiting for Mpesa  ..." : "Deposit from Mpesa"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },

  depositAmountSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  quiz: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginTop: 40,
    width: "80%",
  },

  input: {
    fontWeight: "bold",
    fontSize: 40,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#ccc",
    width: "80%",
    padding: 10,
    textAlign: "center",
    marginTop: 40,
  },

  depositBtn: {
    backgroundColor: "#ed4746",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  depositBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

// Assignment is to look for online analytical mining architecture

/**
 * ERP Class
 * How erp relates to IT architectures in the organization
 * ERP systems aand their underlying architectures
 *
 * 1. Logical Architecture - this has the thereeelements
 *   - interaction - takes care of exchanging data between the different components (Communication)
 *   - database - stores the data -
 *          - Transaction data
 *          - Master data
 *         - Reference data
 *   - business logic - takes care of the business rules
 *
 */
