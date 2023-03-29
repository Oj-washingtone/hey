import { db } from "../../config/firebase";
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

import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Ioicons from "react-native-vector-icons/Ionicons";
import CircularPicker from "react-native-circular-picker";
import CryptoJS from "react-native-crypto-js";

export default function Wallet(props) {
  const userId = props?.userId;
  const fullName = props?.fullName;
  const [seeBalance, setSeeBalance] = useState({
    visible: false,
    walletSize: 100,
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setBalance(100);
  }, []);

  const toggleSeeBalance = () => {
    if (seeBalance.visible) {
      setSeeBalance({
        visible: false,
        walletSize: 100,
      });
    } else {
      setSeeBalance({
        visible: true,
        walletSize: 200,
      });
    }
  };

  // get wallet property of this user from firestore, decrypt it and access the ammount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const docSnapshot = await getDoc(userRef);

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

          setBalance(balance);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWallet();
  }, [userId]);

  return (
    <View>
      <CircularPicker
        size={300}
        steps={[15, 40, 70, 100]}
        gradients={{
          0: ["rgb(52, 199, 89)", "rgb(48, 209, 88)"],
          15: ["rgb(52, 199, 89)", "rgb(48, 209, 88)"],
          40: ["rgb(52, 199, 89)", "rgb(48, 209, 88)"],
          70: ["rgb(52, 199, 89)", "rgb(48, 209, 88)"],
        }}
        // onChange={handleAmountChange}
      >
        <>
          <Text style={{ textAlign: "center" }}>Available wallet balance</Text>
          <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 8 }}>
            {balance} KES
          </Text>
        </>
      </CircularPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  wallet: {
    backgroundColor: "#217ffb",
    borderRadius: 10,
    marginTop: 50,
    padding: 20,
    elevation: 3,
    width: "90%",
  },

  walletHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  walletTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    display: "flex",
    flexDirection: "row",
  },

  walletBalance: {
    marginBottom: 20,
  },

  walletBallanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  walletAmount: {
    fontSize: 30,
    fontWeight: "bold",
  },

  walletNumberWrapper: {
    display: "flex",
    flexDirection: "row",

    // alignSelf: "flex-end",
  },

  walletNumber: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    // letterSpacing: 15,
    marginLeft: 10,
  },

  walletActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },

  walletActionButton: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
