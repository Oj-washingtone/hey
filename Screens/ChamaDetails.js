import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  get,
} from "firebase/firestore";

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";
import CryptoJS from "react-native-crypto-js";

export default function ChamaDetails() {
  const route = useRoute();
  const chamaCode = route.params.chamaCode;

  const navigation = useNavigation();

  const [chamaWalletBalance, setChamaWalletBalance] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "chamas"),
      where("chamaCode", "==", chamaCode)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const { chamaWallet } = data;
        console.log("wallet", chamaWallet);

        try {
          const decryptedWalletString = CryptoJS.AES.decrypt(
            chamaWallet,
            chamaCode.toString()
          ).toString(CryptoJS.enc.Utf8);
          const decryptedWallet = JSON.parse(decryptedWalletString);
          setChamaWalletBalance(parseFloat(decryptedWallet.balance));
        } catch (error) {
          console.error("Error decrypting chama wallet", error);
        }
      });
    });

    return unsubscribe;
  }, [chamaCode]);

  return (
    <View style={styles.container}>
      <Text>Wllet balance is {chamaWalletBalance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
