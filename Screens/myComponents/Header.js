import { db } from "../../config/firebase";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  exists,
  getDocs,
  setDoc,
  get,
  onSnapshot,
} from "firebase/firestore";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";

import HeaderRight from "./HeaderRight";

export default function Header(props) {
  const navigation = useNavigation();

  const chamaName = props.chamaName;
  const chamaCode = props.chamaCode;

  console.log("Chama name: ", chamaName);
  console.log("Chama code: ", chamaCode);

  const [showMenu, setShowMenu] = useState(false);
  const [chamaMembers, setChamaMembers] = useState([]);

  // get all members from chama mambers array in chamas collection

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
    console.log("Menu pressed");
  };

  const seeChamaDetails = () => {
    navigation.navigate("Chama Details");
  };

  const renderChamaMembers = ({ item }) => {
    return (
      <View style={styles.chamaMember}>
        <Text style={styles.chamaMemberText}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerTouchableForDetails}
        onPress={seeChamaDetails}
      >
        <Text style={styles.headerText}>{props.chamaName}</Text>
        <Text style={styles.chamaMembers}>You, </Text>
      </TouchableOpacity>

      <HeaderRight />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingTop: 40,
    width: "100%",
    elevation: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    overflow: "visible",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 16,
  },

  headerTouchableForDetails: {
    flex: 1,
    marginLeft: 20,
  },

  chamaMembers: {
    fontSize: 12,
    marginHorizontal: 16,
  },

  modalBody: {
    flex: 1,
  },
});
