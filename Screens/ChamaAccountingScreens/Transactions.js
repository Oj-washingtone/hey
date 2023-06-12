import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { db } from "../../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Transactions({ route }) {
  const user = useAuthentication();
  const userId = user?.uid;
  const [memberDetails, setMemberDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const chamaDetails = route.params.chamaDetails;
  const transactionHistory = chamaDetails.transactionHistory;

  useEffect(() => {
    const fetchMemberDetails = async () => {
      const memberIds = transactionHistory.map(
        (transaction) => transaction.memberId
      );
      const memberDetailsPromises = memberIds.map(async (memberId) => {
        const memberDoc = await getDoc(doc(db, "users", memberId));
        return memberDoc.data();
      });
      const memberDetailsData = await Promise.all(memberDetailsPromises);
      setMemberDetails(memberDetailsData);
      setLoading(false);
    };

    fetchMemberDetails();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    return date.toLocaleString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          {transactionHistory.length === 0 ? (
            <View style={styles.noTransactions}>
              <Text style={styles.noTransactionsText}>
                No transactions done by any member yet
              </Text>
              <Text style={styles.noTransactionsText}>
                Once a member makes a transaction, it will appear here
              </Text>
            </View>
          ) : (
            <View>
              {transactionHistory.map((transaction, index) => {
                const member = memberDetails[index];

                return (
                  <View key={index} style={styles.transactionItem}>
                    <View style={styles.memberDpWrapper}>
                      {member && member.profilePicture !== "" ? (
                        <Image
                          source={{ uri: member.profilePicture }}
                          style={styles.memberDP}
                          resizeMode="cover"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="account"
                          size={23}
                          color="#D23D74"
                        />
                      )}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.memberName}>
                        {member && member.userId === userId
                          ? "You"
                          : member && member.fullName
                          ? member.fullName
                          : "Unknown Member"}
                      </Text>
                      <Text style={styles.transactionAmount}>
                        Amount: {transaction.amount}
                      </Text>
                      <Text style={styles.transactionDate}>
                        Date: {formatDate(transaction.timestamp.seconds)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noTransactions: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  noTransactionsText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  memberDpWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  memberDP: {
    width: "100%",
    height: "100%",
  },
  transactionInfo: {
    marginLeft: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionAmount: {
    fontSize: 14,
    color: "gray",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "gray",
  },
});
