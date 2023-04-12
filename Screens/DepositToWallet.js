import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CryptoJS from "react-native-crypto-js";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, getIdToken, signOut } from "firebase/auth";

// import use navigation hook
import { useNavigation } from "@react-navigation/native";

export default function DepositToWallet(props) {
  const navigation = useNavigation();

  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;

  const [amount, setAmount] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMpesaRequest = async () => {
    // is the amount field empty?
    if (amount === null) {
      alert("Please fill in an amount to deposit");
      return;
    }
    setLoading(true);

    const userRef = doc(db, "users", userId);

    // Retrieve the encrypted wallet from Firestore
    const userDoc = await getDoc(userRef);
    const { wallet } = userDoc.data();
    // Decrypt the encrypted wallet
    const decryptedWalletString = CryptoJS.AES.decrypt(wallet, userId).toString(
      CryptoJS.enc.Utf8
    );

    // Parse the decrypted JSON string
    const decryptedWallet = JSON.parse(decryptedWalletString);

    //  Update the balance property in the decrypted wallet
    let currentBalance = parseFloat(decryptedWallet.balance);
    decryptedWallet.balance = currentBalance + parseFloat(amount);

    //  Convert the updated wallet to a JSON string
    const updatedWalletString = JSON.stringify(decryptedWallet);

    //  Encrypt the updated wallet
    const encryptedWallet = CryptoJS.AES.encrypt(
      updatedWalletString,
      userId
    ).toString();

    //  Update the `wallet` property in Firestore with the new encrypted wallet value
    await updateDoc(userRef, {
      wallet: encryptedWallet,
    });

    // clear the input field
    setAmount(null);
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      navigation.navigate("Home");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.depositAmountSection}>
        <TextInput
          style={styles.input}
          keyboardType={"number-pad"}
          autoFocus={true}
          cursorColor={"#bd0832"}
          placeholder="Amount"
          onChangeText={(amount) => setAmount(amount)}
        >
          {amount}
        </TextInput>
        {/* show success message if successful deposit  */}
        {success && (
          <Text style={{ color: "#30d166", fontWeight: "bold", marginTop: 10 }}>
            Deposit successful
            {/* Check icon */}
            <MaterialCommunityIcons name="check" color="#30d166" size={20} />
          </Text>
        )}
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
    fontSize: 15,
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
