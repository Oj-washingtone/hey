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
  const userId = props.userId;

  const [showMenu, setShowMenu] = useState(false);
  const [chamaMembersIds, setChamaMembersIds] = useState([]);
  const [chamaMembersDetails, setChamaMembersDetails] = useState([]);
  const [names, setNames] = useState([]);

  // get all members from chama mambers array in chamas collection

  const getChamaMembers = async () => {
    const q = query(
      collection(db, "chamas"),
      where("chamaCode", "==", chamaCode)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setChamaMembersIds(doc.data().chamaMembers);
    });
  };

  useEffect(() => {
    getChamaMembers();
  }, [chamaCode]);

  // get details of each member from users collection from their ids in chama members array
  const getChamaMembersNames = async () => {
    const chamaMembersNames = [];

    for (let i = 0; i < chamaMembersIds.length; i++) {
      try {
        if (chamaMembersIds[i] !== userId) {
          const docRef = doc(db, "users", chamaMembersIds[i]);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            chamaMembersNames.push(docSnap.data().fullName);
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    setNames(chamaMembersNames);
  };

  useEffect(() => {
    getChamaMembersNames();
  }, [chamaMembersIds]);

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
    console.log("Menu pressed");
  };

  const seeChamaDetails = () => {
    console.log("See chama details " + chamaCode);
    navigation.navigate("Chama Details", { chamaCode: chamaCode });
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
        {/* Render the names of chama members from chama members list */}
        <View
          style={styles.chamaMembersWrapper}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          <Text
            style={styles.chamaMembers}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            You,{" "}
            {names.map((name, index) => {
              return <Text key={index}>{name}, </Text>;
            })}
          </Text>
        </View>
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

  chamaMembersWrapper: {
    width: "100%",
    flexDirection: "row",
  },
  chamaMembers: {
    width: "100%",
    fontSize: 12,
    marginHorizontal: 16,
  },
  modalBody: {
    flex: 1,
  },
});
