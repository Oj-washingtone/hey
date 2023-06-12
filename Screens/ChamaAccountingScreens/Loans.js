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

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";

export default function Loans({ route }) {
  const chamaDetails = route.params.chamaDetails;
  const accounting = chamaDetails.accounting;

  // Calculate total loans
  const totalLoans = chamaDetails.accounting.reduce((total, member) => {
    return total + member.loanTotal;
  }, 0);

  // Calculate total repaid loans
  const totalRepaidLoans = chamaDetails.accounting.reduce((total, member) => {
    // Assuming a loan is considered repaid if remainingAmount is 0
    const repaidLoans = member.loans.filter(
      (loan) => loan.remainingAmount === 0
    );
    const repaidLoanTotal = repaidLoans.reduce(
      (sum, loan) => sum + loan.amount,
      0
    );
    return total + repaidLoanTotal;
  }, 0);

  // Calculate total pending loans
  const totalPendingLoans = totalLoans - totalRepaidLoans;

  // Calculate total interest earned
  const totalInterestEarned = chamaDetails.accounting.reduce(
    (total, member) => {
      return total + member.totalInterestEarned;
    },
    0
  );

  const membersWithPendingLoans = chamaDetails.accounting.filter((member) => {
    return member.loans.some((loan) => loan.remainingAmount > 0);
  });

  membersWithPendingLoans.forEach(async (member) => {
    const userRef = doc(db, "users", member.memberId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      // Access the user details and perform actions
      console.log("User with pending loan:", userData);
    } else {
      console.log("User not found:", member.memberId);
    }
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.loanDistribution}>
        <View style={styles.deistributionItem}>
          <Text style={styles.title}>Total Loans</Text>
          <Text style={styles.amount}>Kes. {totalLoans}</Text>
        </View>

        <View style={styles.deistributionItem}>
          <Text style={styles.title}>Total Repaid Loans</Text>
          <Text style={styles.amount}>Kes. {totalRepaidLoans}</Text>
        </View>

        <View style={styles.deistributionItem}>
          <Text style={styles.title}>Total Pending Loans</Text>
          <Text style={styles.amount}>Kes. {totalPendingLoans}</Text>
        </View>

        <View style={styles.deistributionItem}>
          <Text style={styles.title}>Total Interest Earned</Text>
          <Text style={styles.amount}>Kes. {totalInterestEarned}</Text>
        </View>
      </View>

      <Text style={styles.title}>Pending Borrowings List</Text>
      <View>
        {membersWithPendingLoans.length > 0 ? (
          membersWithPendingLoans.map((member) => (
            <View key={member.memberId} style={styles.deistributionItem}>
              <Text>Full Name: {member.fullName}</Text>
              <Text>Phone Number: {member.phoneNumber}</Text>
              <Text>Email: {member.email}</Text>
            </View>
          ))
        ) : (
          <Text>No members with pending loans</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  deistributionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
