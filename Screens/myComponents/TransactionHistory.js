import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "react-native-vector-icons";

export default function TransactionList(props) {
  const navigation = useNavigation();

  const [transactionList, setTransactionList] = useState([
    {
      id: 1,
      title: "Chama name",
      amount: 1000,
      date: "2021-09-01",
      type: "credit",
    },
    {
      id: 2,
      title: "Informatics chama",
      amount: 1000,
      date: "2021-09-01",
      type: "Debit",
    },
    {
      id: 3,
      title: "Another chama",
      amount: 1000,
      date: "2021-09-01",

      type: "credit",
    },
    {
      id: 4,
      title: "Another chama",
      amount: 1000,
      date: "2021-09-01",
      type: "Debit",
    },
  ]);

  return (
    <View style={styles.txnList}>
      <FlatList
        data={transactionList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.txnItem}>
            <View style={styles.recipientDP}>
              <Image
                source={require("./../../assets/chamaDps/logo2.png")}
                style={styles.dp}
              />
            </View>
            <View style={styles.transactionDetails}>
              <View style={styles.txnItemLeft}>
                <Text style={styles.txnItemTitle}>{item.title}</Text>
                <Text style={styles.txnItemDate}>{item.date}</Text>
              </View>
              <View style={styles.txnItemRight}>
                <Text style={styles.txnItemAmount}>Kes. {item.amount}</Text>
                {item.type === "credit" ? (
                  <MaterialCommunityIcons
                    name="menu-down"
                    size={24}
                    color="green"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="menu-up"
                    size={24}
                    color="red"
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  txnItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  txnItemLeft: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  txnItemRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  txnItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },

  txnItemDate: {
    fontSize: 12,
    fontWeight: "bold",
    color: "gray",
  },

  txnItemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
  },

  txnList: {
    width: "100%",
    padding: 10,
  },

  recipientDP: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "#ccc",
  },

  dp: {
    width: "100%",
    height: "100%",
    borderRadius: 40 / 2,
  },

  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "93%",
    paddingHorizontal: 10,
  },
});
