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

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import CryptoJS from "react-native-crypto-js";
import RadioGroup from "react-native-radio-buttons-group";

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
      navigation.navigate("Wallet");
    }, 1000);
  };

  const [radioButton, setRadioButton] = useState([
    {
      id: "1",
      label: "M~pesa",
      value: "My number",
      color: "#bd0832",
      size: 20,
      disabled: false,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginLeft: 10,
      selected: true,
    },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.depositAmountSection}>
        <RadioGroup
          radioButtons={radioButton}
          containerStyle={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: 20,
            with: "100%",
            backgroundColor: "#f2f3f5",
          }}
        />
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
        <LinearGradient
          colors={["#ed4746", "#A353BB"]}
          start={[0.1, 0.1]}
          end={[1, 1]}
          style={styles.btnBackground}
        >
          {loading && <ActivityIndicator size="small" color="#fff" />}
          <Text style={styles.depositBtnText}>
            {loading ? "Waiting for Mpesa  ..." : "Deposit"}
          </Text>
        </LinearGradient>
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

  btnBackground: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  depositBtn: {
    width: "80%",
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
