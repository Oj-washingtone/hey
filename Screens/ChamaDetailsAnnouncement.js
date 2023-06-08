import { useState } from "react";
import { Share } from "react-native";
import { getRandomBytes } from "react-native-get-random-values";
import CryptoJS from "react-native-crypto-js";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { db } from "../config/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

// Icons
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ChamaDetailsAnnouncement({ navigation, route }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;
  const userName = route.params?.userName;

  const { chamaCode, chamaName, chamaDescription, chamaPassword } =
    route.params;

  const gotoChama = () => {
    navigation.replace("Chama", {
      chamaDetails: chamaDetails,
      userId: userId,
      userName: userName,
      chamaName: chamaDetails.chamaName,
      chamaCode: chamaDetails.chamaCode,
    });
  };

  const shareInvite = async () => {
    try {
      const result = await Share.share({
        message: `I am inviting you to join  ${chamaName} on ChamaSmart. Please use Chama code: ${chamaCode}, and password: ${chamaPassword} to join.`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chamaDetails}>
        <MaterialCommunityIcons name="party-popper" size={64} color="orange" />

        <Text style={styles.title}>Congratulations</Text>

        <View style={styles.details}>
          <Text style={[styles.title, { marginBottom: 20 }]}>
            A Chama has been created for you with the following details
          </Text>

          <View style={styles.tableRow}>
            <Text style={styles.title}>Chama Name:</Text>
            <Text style={styles.detail}>{chamaName}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.title}>Description:</Text>
            <Text style={styles.detail}>{chamaDescription}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.title}>Chama Code:</Text>
            <Text style={styles.detail}>{chamaCode}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.title}> Password:</Text>
            <Text style={styles.detail}>{chamaPassword}</Text>
          </View>

          <Text>
            Please note that members wishing joining this chama will need your
            chama Code and password, note that these details important to your
            chama and therefore should be kept secret to your members.
          </Text>

          <View style={styles.actionWrapper}>
            <TouchableOpacity
              style={[styles.btn, styles.btnInvite]}
              activeOpacity={0.6}
              onPress={shareInvite}
            >
              <MaterialCommunityIcons
                name="account-multiple-plus-outline"
                size={24}
                color="#000"
              />
              <Text style={styles.inviteTextBtn}>Invite members </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn]}
              activeOpacity={0.6}
              onPress={gotoChama}
            >
              <Text style={styles.actionsText}>Goto chama</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 60,
    marginTop: 20,
  },

  btnInvite: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
  },

  btn: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
  },

  actionsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  chamaDetails: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

/**
 * enhance rather than supplant the existing financial system
 */
