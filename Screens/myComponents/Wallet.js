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

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";

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
import ChamaList from "./ChamaList";

import TransactionList from "./TransactionHistory";

export default function Wallet(props) {
  const userId = props?.userId;
  const fullName = props?.fullName;
  const [seeBalance, setSeeBalance] = useState({
    visible: false,
    walletSize: 100,
  });
  const [balance, setBalance] = useState(0);

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
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const { wallet } = docSnapshot.data();
        console.log("Personal wallet = ", wallet);

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
    });

    return unsubscribe;
  }, [userId]);

  return (
    <View>
      <LinearGradient
        colors={["#0af7e7", "#f70ae3"]}
        style={styles.wallet}
        // make gradient flow from left to right
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.card}>
          <View style={styles.accountTop}>
            <View style={styles.logo}>
              <MaterialCommunityIcons
                name="lightning-bolt-circle"
                size={26}
                color="black"
              />
              <Text style={styles.logoText}>brighter Card</Text>
            </View>
            <Text style={styles.walletHeader}>My wallet</Text>
          </View>

          <View style={styles.availableWalletBalance}>
            <Text style={styles.balanceTitle}>Available balance</Text>
            <Text style={styles.cardBalance}>{balance} KES</Text>
          </View>

          <View style={styles.walletNumber}>
            <Text style={styles.walletNumberText}>**** **** **** 1234</Text>
          </View>

          <View style={styles.walletBottom}></View>
        </View>
      </LinearGradient>

      <View style={styles.walletActions}>
        <TouchableOpacity style={styles.walletActionBtn}>
          <MaterialCommunityIcons name="cash-plus" size={30} color="black" />
          <Text>Top up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.walletActionBtn}>
          <MaterialCommunityIcons name="cash-fast" size={30} color="black" />
          <Text>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.walletActionBtn}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={30}
            color="black"
          />
          <Text>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.walletActionBtn}>
          <MaterialCommunityIcons name="cash-check" size={30} color="black" />
          <Text>Pay</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sections}>
        <Text style={styles.title}>Next transaction</Text>
        <View style={styles.scheduleCard}>
          <View style={styles.dateWrapper}>
            <Text style={styles.scheduleDate}>20</Text>
            <Text>April / 2023</Text>
          </View>

          <Text style={styles.nextPaymentAmount}>Kes 200</Text>

          <View>
            <View>
              <Text style={styles.paidTo}>Club 20</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.sections}>
        <Text style={styles.title}>Transaction History</Text>
        <TransactionList userId={userId} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wallet: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    padding: 10,
    marginTop: 30,
  },

  sections: {
    marginVertical: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 20,
  },

  card: {
    width: "100%",
    padding: 10,
  },

  accountTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },

  availableWalletBalance: {
    paddingVertical: 10,
    marginVertical: 10,
  },

  cardBalance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 10,
  },

  walletNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 10,
  },

  walletActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 30,
  },

  walletActionBtn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f2f3f5",
    borderRadius: 10,
    minWidth: 80,
  },

  scheduleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  scheduleDate: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#04c765",
  },
  dateWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  nextPaymentAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  paidTo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
});
