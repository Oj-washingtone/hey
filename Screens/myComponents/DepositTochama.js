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
  Keyboard,
} from "react-native";

// import icons from react-native-vector-icons
import Ioicons from "react-native-vector-icons/Ionicons";

import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";
import CryptoJS from "react-native-crypto-js";

export default function ChamaDepositForm(props) {
  const chamaCode = props?.chamaCode;
  const userId = props.userId;

  const [showContributionForm, setShowContributionForm] = useState(false);
  const [showLoanRequestForm, setShowLoanRequestForm] = useState(false);
  const [showLoanRepaymentForm, setShowLoanRepaymentForm] = useState(false);
  const [showFinePaymentForm, setShowFinePaymentForm] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
  });

  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(null);

  const [notification, setNotification] = useState(null);

  // get details of this user from firestore
  useEffect(() => {
    const getUserDetails = async (userId) => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        setIsOnline(false);
        console.log(error);
      }
    };

    if (userId) {
      getUserDetails(userId);
    }
  }, [userId]);

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

  const depositToChama = async () => {
    // set loading to true

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

    // dismiss keyboard
    Keyboard.dismiss();

    setLoading(true);
    setNotification("Deducting from your wallet...");
    try {
      await update_User_Balance();
      setNotification("Sending to chama wallet...");

      const chamaRef = doc(db, "chamas", chamaCode.toString());
      const chamaDoc = await getDoc(chamaRef);
      const chamaDetails = chamaDoc.data();

      // Convert chamaDetails into a regular JavaScript object
      const chamaDetailsCopy = JSON.parse(JSON.stringify(chamaDetails));

      // Add the contribution to the accounting entry
      const accountingEntry = chamaDetailsCopy.accounting.find(
        (entry) => entry.memberId === userId
      );

      accountingEntry.contributions.push({
        amount: parseFloat(amount),
        timestamp: new Date(),
      });

      // Update the contribution total in the accounting entry
      accountingEntry.contributionTotal += parseFloat(amount);

      // Add the transaction to the transaction history
      chamaDetailsCopy.transactionHistory.push({
        type: "deposit",
        memberId: userId,
        amount: parseFloat(amount),
        timestamp: new Date(),
      });

      // Update the chama details in Firestore
      await setDoc(chamaRef, chamaDetailsCopy);

      // Add the transaction to the transaction history
      chamaDetailsCopy.transactionHistory.push({
        type: "contribution",
        memberId: userId,
        amount: parseFloat(amount),
        timestamp: new Date(),
      });

      // Update the chama details in Firestore
      await setDoc(chamaRef, chamaDetailsCopy);
      setAmount("");

      setLoading(false);
      alert("Kes\t" + amount + "\tDeposited to chama successfully");
      setNotification(null);

      // notify members of the contribution but first convert full name to capital letters

      // Split the full name into an array of individual names
      const names = userDetails.fullName.split(" ");

      // Capitalize the first character of each name
      const capitalizedNames = names.map(
        (name) => name.charAt(0).toUpperCase() + name.slice(1)
      );

      // Join the capitalized names back into a single string
      const modifiedFullName = capitalizedNames.join(" ");

      const message = {
        message: `${modifiedFullName}has made a new contribution of KES ${amount}, your new balance is KES ${chamaDetailsCopy.accounting[0].contributionTotal}`,
        type: "transaction",
        senderID: "ChamaSmart",
        senderName: "Chama Smart",
        timestamp: new Date(),
        id: String(chamaDetailsCopy.messages.length + 1),
      };

      chamaDetailsCopy.messages.push(message);
      await setDoc(chamaRef, chamaDetailsCopy);
    } catch (error) {
      setLoading(false);
      setNotification(null);
      alert("Could not complete your deposit. Please try again.");
    }
  };

  // request loan from chama
  const requestLoanFromChama = async () => {
    if (!amount) {
      alert("Amount is required");
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    setNotification("Sending loan request...");

    try {
      const chamaRef = doc(db, "chamas", chamaCode.toString());
      const chamaDoc = await getDoc(chamaRef);
      const chamaDetails = chamaDoc.data();

      // Add the loan request to the member's accounting entry
      const accountingEntry = chamaDetails.accounting.find(
        (entry) => entry.memberId === userId
      );

      // generate unique alphanumeric loan id
      const loanId = Math.random().toString(36).substr(2, 9);

      accountingEntry.loans.push({
        amount: parseFloat(amount),
        timestamp: new Date(),
        status: "waiting approval",
        repaymentStatus: "",
        repaymentDueDate: "",
        remainingAmount: parseFloat(amount),
        interestRate: chamaDetails.chamaRules.borrowingInterestRate,
        numberOfApprovals: 0,
        numberOfDeclines: 0,
        loanId: loanId,
      });

      // Add a loan request message

      const names = userDetails.fullName.split(" ");
      const capitalizedNames = names.map(
        (name) => name.charAt(0).toUpperCase() + name.slice(1)
      );
      const modifiedFullName = capitalizedNames.join(" ");

      const message = {
        message: `${modifiedFullName} is equesting a Loan of KES ${amount}, their total saving is KES ${accountingEntry.contributionTotal} `,
        type: "loan request",
        senderID: "ChamaSmart",
        senderName: "ChamaSmart",
        timestamp: new Date(),
        id: String(chamaDetails.messages.length + 1),
        for: userId,
        loanId: loanId,
      };

      chamaDetails.messages.push(message);

      // Update the chama details in Firestore
      await setDoc(chamaRef, chamaDetails);
      setAmount("");

      setLoading(false);
      alert("Loan request sent successfully");
      setNotification(null);
    } catch (error) {
      setLoading(false);
      setNotification(null);
      alert("Could not send loan request. Please try again.");
    }
  };

  return (
    <View style={styles.depositForm}>
      {showContributionForm && (
        <View style={[styles.form]}>
          <Text>Deposit Contribution</Text>
          <TextInput
            value={amount}
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
              {notification ? notification : "Send"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowContributionForm(false);
              setShowLoanRequestForm(false);
              setShowLoanRepaymentForm(false);
              setShowFinePaymentForm(false);
              setShowOptions(true);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {showLoanRequestForm && (
        <View style={[styles.form]}>
          <Text>Request Loan</Text>
          <TextInput
            value={amount}
            placeholder="Amount in (KES)"
            keyboardType="numeric"
            style={styles.amount}
            onChangeText={(text) => setAmount(text)}
            cursorColor="#ed4746"
          />
          <TouchableOpacity
            style={styles.sendButton}
            activeOpacity={0.5}
            onPress={requestLoanFromChama}
          >
            {loading && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.sendButtonText}>
              {notification ? notification : "Send loan request"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowContributionForm(false);
              setShowLoanRequestForm(false);
              setShowLoanRepaymentForm(false);
              setShowFinePaymentForm(false);
              setShowOptions(true);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {showLoanRepaymentForm && (
        <View style={[styles.form]}>
          <Text>Loan repayment</Text>
          <TextInput
            value={amount}
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
              {notification ? notification : "Send"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowContributionForm(false);
              setShowLoanRequestForm(false);
              setShowLoanRepaymentForm(false);
              setShowFinePaymentForm(false);
              setShowOptions(true);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {showFinePaymentForm && (
        <View style={[styles.form]}>
          <Text>Pay fine/penalties</Text>
          <TextInput
            value={amount}
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
              {notification ? notification : "Send"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowContributionForm(false);
              setShowLoanRequestForm(false);
              setShowLoanRepaymentForm(false);
              setShowFinePaymentForm(false);
              setShowOptions(true);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {showOptions && (
        <View style={[styles.buttonsOptionsWrapper]}>
          <TouchableOpacity
            style={styles.btnOptions}
            onPress={() => {
              setShowContributionForm(true);
              setShowOptions(false);
            }}
          >
            <Text>Send contribution</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOptions}
            onPress={() => {
              setShowLoanRequestForm(true);
              setShowOptions(false);
            }}
          >
            <Text>Request Loan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOptions}
            onPress={() => {
              setShowLoanRepaymentForm(true);
              setShowOptions(false);
            }}
          >
            <Text>Loan repayment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOptions}
            onPress={() => {
              setShowFinePaymentForm(true);
              setShowOptions(false);
            }}
          >
            <Text>Pay fine/penalties</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  depositForm: {
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    // give it an elevation of 3
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

  btnOptions: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 15,
  },

  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "40%",
  },
});
