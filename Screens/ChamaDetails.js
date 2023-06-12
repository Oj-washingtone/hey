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
  ScrollView,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Share } from "react-native";

import ChamaMemberList from "./myComponents/ChamaMembersList";

export default function ChamaDetails() {
  const route = useRoute();
  const chamaCode = route.params.chamaCode;

  const navigation = useNavigation();

  const [chamaDetails, setChamaDetails] = useState({});
  const [chamaInitials, setChamaInitials] = useState("");

  const [memberDetails, setMemberDetails] = useState([]);

  useEffect(() => {
    const chamaRef = doc(db, "chamas", chamaCode.toString());

    const unsubscribe = onSnapshot(chamaRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setChamaDetails(docSnapshot.data());
      } else {
        alert("Error getting details");
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [chamaCode]);

  // chamaDetails.chamaName.charAt(0).toUpperCase();
  // setChamaInitials(chamaInitials);

  const shareInvite = async () => {
    try {
      const result = await Share.share({
        message: `I am inviting you to join  ${chamaDetails.chamaName} on ChamaSmart. Please use Chama code: ${chamaDetails.chamaCode}, and password: ${chamaDetails.chamaPassword} to join.`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const gotoChamaAccounts = () => {
    navigation.navigate("Chama Accounts", chamaDetails);
  };

  const gotoChamaMettings = () => {
    alert("Going to chama meeting");
  };

  const gotoChamaProjects = () => {
    alert("Going to chama projects");
  };

  const gotoChamaRules = () => {
    alert("Going to chama rules");
  };

  console.log(chamaDetails);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.basicDetails, styles.layout]}>
          <View
            style={[
              styles.chamaDp,
              { backgroundColor: chamaDetails.chamaColor },
            ]}
          >
            {chamaDetails.chamaDP ? (
              <Image
                source={{ uri: chamaDetails.chamaDP }}
                style={styles.chamaDpImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.chamaDPText}>
                {chamaDetails.chamaName?.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text style={styles.chamaName}>{chamaDetails.chamaName}</Text>

          {/* Share chama button */}
          <TouchableOpacity
            style={styles.shareChama}
            activeOpacity={0.5}
            onPress={shareInvite}
          >
            <Text style={styles.shareChamaText}>Invite Members</Text>
            <MaterialCommunityIcons
              name="share-variant"
              size={23}
              color="#D23D74"
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.layout]}>
          <Text>
            Chama Code: <Text style={styles.info}>{chamaCode}</Text>
          </Text>
        </View>

        <View style={[styles.layout]}>
          <Text style={styles.title}>About</Text>
          <Text>{chamaDetails.chamaDescription}</Text>
        </View>

        <View style={[styles.menu, styles.layout]}>
          <TouchableOpacity
            style={styles.menuOption}
            activeOpacity={0.5}
            onPress={gotoChamaAccounts}
          >
            <MaterialCommunityIcons
              name="account-cash"
              size={23}
              color="#D23D74"
            />
            <Text style={styles.menuOptionText}>Accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuOption}
            activeOpacity={0.5}
            onPress={gotoChamaMettings}
          >
            <MaterialCommunityIcons
              name="calendar-multiple-check"
              size={23}
              color="#D23D74"
            />
            <Text style={styles.menuOptionText}>Mettings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuOption}
            activeOpacity={0.5}
            onPress={gotoChamaProjects}
          >
            <MaterialCommunityIcons
              name="align-horizontal-left"
              size={23}
              color="#D23D74"
            />
            <Text style={styles.menuOptionText}>Chama projects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuOption}
            activeOpacity={0.5}
            onPress={gotoChamaRules}
          >
            <MaterialCommunityIcons
              name="file-account-outline"
              size={23}
              color="#D23D74"
            />
            <Text style={styles.menuOptionText}>Chama Rules</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.members, styles.layout]}>
          <Text style={styles.title}>
            Members ({chamaDetails.chamaMembers?.length})
          </Text>
          <View style={styles.financeStatus}>
            <View style={styles.status}>
              <View
                style={[styles.statusDot, { backgroundColor: "#2ECC71" }]}
              ></View>
              <Text>Paid contribution</Text>
            </View>

            <View style={styles.status}>
              <View
                style={[styles.statusDot, { backgroundColor: "yellow" }]}
              ></View>
              <Text>Contribution not paid</Text>
            </View>
            <View style={styles.status}>
              <View
                style={[styles.statusDot, { backgroundColor: "#D03F9B" }]}
              ></View>
              <Text>Has loan</Text>
            </View>
            <View style={styles.status}>
              <View
                style={[styles.statusDot, { backgroundColor: "red" }]}
              ></View>
              <Text>Has overdue loan</Text>
            </View>
          </View>
          <ChamaMemberList
            chamaMembers={chamaDetails.chamaMembers}
            chamaCode={chamaDetails.chamaCode}
          />
        </View>

        <View style={[styles.footer, styles.layout]}>
          <TouchableOpacity style={styles.menuOption} activeOpacity={0.5}>
            <MaterialCommunityIcons
              name="account-multiple-remove-outline"
              size={24}
              color="red"
            />
            <Text style={styles.menuOptionText}>Report issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOption} activeOpacity={0.5}>
            <MaterialCommunityIcons
              name="account-voice"
              size={24}
              color="red"
            />
            <Text style={styles.menuOptionText}>
              Launch Complaint to Members
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f3f5",
    alignItems: "center",
    justifyContent: "center",
  },

  basicDetails: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  menu: {},

  layout: {
    width: "100%",
    backgroundColor: "#fff",
    elevation: 3,
    paddingHorizontal: 20,
    marginBottom: 10,
    padding: 10,
  },

  chamaDp: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  chamaDpImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },

  chamaDPText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
  },

  chamaName: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },

  menuOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  menuOptionText: {
    marginLeft: 20,
    fontSize: 15,
  },

  shareChama: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  shareChamaText: {
    marginRight: 10,
    fontSize: 15,
    color: "#D23D74",
  },
  financeStatus: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
    paddingBottom: 10,
  },

  status: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginRight: 5,
  },
});
