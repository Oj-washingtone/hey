import { db } from "../../config/firebase";
import {
  collection,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  setDoc,
  get,
} from "firebase/firestore";

import * as NavigationBar from "expo-navigation-bar";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// import icons from react-native-vector-icons
import Ioicons from "react-native-vector-icons/Ionicons";

import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";
import CryptoJS from "react-native-crypto-js";

export default function ChamaDepositForm(props) {
  const chamaCode = props.chamaCode;
  const userId = props.userId;

  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(null);

  // get user balance

  useEffect(() => {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const { wallet } = docSnapshot.data();

        // Step 1: Decrypt the encrypted wallet
        const decryptedWalletString = CryptoJS.AES.decrypt(
          wallet,
          userId
        ).toString(CryptoJS.enc.Utf8);

        // Step 2: Parse the decrypted JSON string
        const decryptedWallet = JSON.parse(decryptedWalletString);

        // Step 3: Access the balance property of the decrypted wallet
        const { balance } = decryptedWallet;

        setUserBalance(balance);
      }
    });

    return unsubscribe;
  }, [userId]);

  const update_User_Balance = async () => {
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
    decryptedWallet.balance = currentBalance - parseFloat(amount);

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

    console.log("User balance updated");
  };

  // update chama wallet
  const update_Chama_Wallet = async () => {
    const q = query(
      collection(db, "chamas"),
      where("chamaCode", "==", chamaCode)
    );
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot);
  };

  const depositToChama = async () => {
    if (!amount) {
      alert("Amount is required");
      return;
    }

    if (parseFloat(amount) > userBalance) {
      alert(
        `Insufficient funds, to deposit KES ${amount} your current wallet balance is KES ${userBalance}`
      );
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    // update user balance
    await update_User_Balance();

    // get chama wallet
    update_Chama_Wallet();
  };

  return (
    <View style={styles.depositForm}>
      <Text>Deposit to chama</Text>
      <TextInput
        // value={amount}
        placeholder="Amount in (KES)"
        keyboardType="numeric"
        style={styles.amount}
        onChangeText={(text) => setAmount(text)}
        cursorColor="#ed4746"
      />
      <TouchableOpacity
        style={styles.sendButton}
        activeOpacity={0.5}
        onPress={depositToChama}
      >
        {loading && <ActivityIndicator size="small" color="#fff" />}
        <Text style={styles.sendButtonText}>
          {loading ? "Processing..." : "Send"}
        </Text>
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
    fontWeight: "bold",
  },

  sendButton: {
    backgroundColor: "#2e64e5",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  sendButtonText: {
    color: "#fff",
  },
});
