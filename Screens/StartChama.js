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

import { db } from "../config/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

// Icons
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StartChamaScreen({ navigation, route }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;
  const userName = route.params?.userName;

  const [loading, setLoading] = useState(false);
  const [chamaDetails, setChamaDetails] = useState({
    chamaName: "",
    chamaDescription: "",
    chamaCode: "",
    chamaPassword: "",
    chamaWallet: "",
    error: "",
  });

  const [chamaCreated, setChamaCreated] = useState(false);

  const startChama = async () => {
    // check for empty fields
    if (chamaDetails.chamaName === "" || chamaDetails.chamaDescription === "") {
      setChamaDetails({
        ...chamaDetails,
        error: "Pleas make sure to fill all the required details then continue",
      });

      return;
    }

    // gnereate uniquer 8 digits chama code
    const chamaWallet = Math.floor(10000000 + Math.random() * 90000000);

    // generate unique 6 digits chama code
    const chamaCode = Math.floor(100000 + Math.random() * 900000);

    // generate 6 characters alphanumeric chama password
    const chamaPassword = Math.random().toString(36).slice(-6);

    // set chama details
    setChamaDetails({
      ...chamaDetails,
      chamaCode: chamaCode,
      chamaPassword: chamaPassword,
      chamaWallet: chamaWallet,
    });

    const wallet = {
      id: chamaWallet,
      type: "group",
      currency: "KES",
      balance: 0,
      transactions: [],
      createdDate: new Date(),
      modifiedDate: new Date(),
      status: "active",
      fundsAllocation: [],
    };

    // ecrypt wallet
    // const encryptedWallet = CryptoJS.AES.encrypt(
    //   JSON.stringify(wallet),
    //   chamaCode.toString()
    // ).toString();

    // console.log("walletString", encryptedWallet);
    // console.log("wallet", chamaCode);

    // generate random color for chama
    const h = Math.floor(Math.random() * 360);

    function hslToHex(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hueToRgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
        g = Math.round(hueToRgb(p, q, h) * 255);
        b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);
      }

      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    }

    const hexColor = hslToHex(h, 90, 60);

    // create chama on firestore
    try {
      setLoading(true);
      const chamaRef = doc(db, "chamas", chamaCode.toString());
      await setDoc(chamaRef, {
        chamaName: chamaDetails.chamaName,
        chamaDescription: chamaDetails.chamaDescription,
        chamaCode: chamaCode,
        chamaPassword: chamaPassword,
        chamaMembers: [userId],
        chamaDP: "",
        chamaAdmins: [userId],
        // messages within the space
        messages: [
          {
            message: `Welcome to ${chamaDetails.chamaName}`,
            type: "normal",
            senderID: "ChamaSmart",
            senderName: "Chama Smart",
            timestamp: new Date(),
            id: "1",
          },

          {
            message:
              "In this space, you will be able to do your chama governed by yur own rules. you can define rules to automate financial processes, and govern memberships, and the app will take care of implementing and enforcing the rules you and your members define ",
            type: "normal",
            senderID: "ChamaSmart",
            senderName: "Chama Smart",
            timestamp: new Date(),
            id: "2",
          },

          {
            message:
              "To start creating the rules, you need to admit at least three members.",
            type: "normal",
            senderID: "ChamaSmart",
            senderName: "Chama Smart",
            timestamp: new Date(),
            id: "3",
          },

          {
            message:
              "Your team can always contact us by starting your message with @ChamaSmart, and well always ready to respond. \n Happy Chamaing ;)",
            type: "normal",
            senderID: "ChamaSmart",
            senderName: "Chama Smart",
            timestamp: new Date(),
            id: "4",
          },
        ],
        // members on waiting list to join this chama
        memberWaitList: [],
        chamaWallet: wallet,
        chamaRules: [],
        chamaCreatedDate: new Date(),
        chamaColor: hexColor, //`hsl(${h}deg, 90%, 85%)`,
      });

      setChamaCreated(true);

      // update has chama to true
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          hasChama: true,
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }

    navigation.replace("Chama Basic Rules", {
      chamaCode: chamaCode,
      chamaName: chamaDetails.chamaName,
      chamaDescription: chamaDetails.chamaDescription,
      chamaPassword: chamaPassword,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.container, styles.createChamaForm]}>
        <View>
          <Text style={styles.notice}>
            You are about to start a chama on Chama Smart. Please note that you
            and other members of the chama will be required to operate the chama
            in accordance to the terms and conditions of the app. If you agree
            to these terms and conditions, please feel the form below to get
            started your chama.
          </Text>
        </View>
        <View style={styles.startChamaForm}>
          {!!chamaDetails.error && (
            <View style={styles.error}>
              <Text style={styles.errorMessage}>{chamaDetails.error}</Text>
            </View>
          )}

          <Text style={styles.title}>Name of the chama</Text>
          <TextInput
            style={styles.input}
            placeholder="Chama Name"
            onChangeText={(text) =>
              setChamaDetails({ ...chamaDetails, chamaName: text })
            }
          />
          <Text style={styles.title}>Chama Description</Text>
          <TextInput
            style={[styles.input, styles.description]}
            placeholder="Type something"
            multiline={true}
            onChangeText={(text) =>
              setChamaDetails({ ...chamaDetails, chamaDescription: text })
            }
          />

          <TouchableOpacity style={styles.startChamaBtn} onPress={startChama}>
            {loading && <ActivityIndicator color="#fff" />}
            <Text style={styles.btnText}>
              {loading ? "Please wait..." : "Save and continue"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.additional}>
          <Text style={[styles.joinChamaText]}>
            Your chama has already been created ?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Join Chama")}>
            <Text style={[styles.joinChamaText, styles.joinChamaBtn]}>
              Join the Chama
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  createChamaForm: {
    width: "100%",
    paddingHorizontal: 0,
  },

  chamaDetails: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    alignItems: "center",
  },

  notice: {
    fontSize: 16,
    color: "#000",
    marginTop: 30,
  },

  startChamaForm: {
    width: "90%",
    marginVertical: 40,
  },

  input: {
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  description: {
    maxHeight: 100,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  startChamaBtn: {
    width: "100%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#ed4746",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  additional: {
    flexDirection: "row",
    width: "90%",
  },

  joinChamaText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "gray",
  },

  joinChamaBtn: {
    color: "#ed4746",
  },

  error: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 20,
    marginBottom: 10,
  },
  errorMessage: {
    color: "#721c24",
  },

  details: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
  },

  detail: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginVertical: 10,
  },

  actionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
  },

  btn: {
    width: "auto",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    flexDirection: "row",
  },

  actionsText: {
    color: "#fff",
    fontWeight: "bold",
    marginHorizontal: 10,
  },

  inviteWrapper: {
    width: "100%",
    marginTop: 20,
  },

  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  btnInvite: {
    backgroundColor: "#fff",
  },

  inviteTextBtn: {
    marginLeft: 10,
  },
});

/**
 * enhance rather than supplant the existing financial system
 */
