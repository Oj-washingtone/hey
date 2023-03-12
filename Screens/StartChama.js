import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";
// material community icons
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StartChamaScreen({ navigation }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;

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

    // create chama on firestore
    try {
      setLoading(true);
      const chamaRef = doc(db, "chamas", chamaCode.toString());
      await setDoc(chamaRef, {
        chamaName: chamaDetails.chamaName,
        chamaDescription: chamaDetails.chamaDescription,
        chamaCode: chamaCode,
        chamaPassword: chamaPassword,
        chamaWallet: chamaWallet,
        chamaMembers: [
          {
            userId: userId,
            role: "admin",
            savings: 0,
            loans: 0,
            interestOnSvaings: 0,
            interestOnLoans: 0,
            creditScore: 0,
          },
        ],
        chamaDP: "",
      });

      setLoading(false);
      setChamaCreated(true);

      // navigate to  messaging UI with chama details
      // navigation.navigate("Messaging UI", chamaDetails);

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
  };

  const gotoChama = () => {
    navigation.navigate("Chama", { chamaDetails: chamaDetails });
  };

  return (
    <View style={styles.container}>
      {/* If chama has been created successfully hide form and show chama details */}
      {chamaCreated ? (
        <View style={styles.chamaDetails}>
          {/* Add a check icon from aterial community */}
          <MaterialCommunityIcons
            name="party-popper"
            size={64}
            color="orange"
          />

          <Text style={styles.title}>Congratulations</Text>

          {/* Display picture of peope icon */}

          <View style={styles.details}>
            <Text style={[styles.title, { marginBottom: 20 }]}>
              A Chama has been created for you with the following details
            </Text>
            <Text style={styles.title}>Chama Name:</Text>
            <Text style={styles.detail}>{chamaDetails.chamaName}</Text>
            <Text style={styles.title}>Description:</Text>
            <Text style={styles.detail}>{chamaDetails.chamaDescription}</Text>
            <Text style={styles.title}>Chama Code:</Text>
            <Text style={styles.detail}>{chamaDetails.chamaCode}</Text>
            <Text style={styles.title}> Password:</Text>
            <Text style={styles.detail}>{chamaDetails.chamaPassword}</Text>
            <Text style={styles.title}>Account number:</Text>
            <Text style={styles.detail}>{chamaDetails.chamaWallet}</Text>

            <Text>
              Please note that members wishing joining this chama will need your
              chama Code and password, note that these details important to your
              chama and therefore should be kept secret to your members.
            </Text>

            <View style={styles.actionWrapper}>
              <TouchableOpacity style={[styles.btn]} activeOpacity={0.6}>
                <MaterialCommunityIcons
                  name="account-multiple-plus"
                  size={24}
                  color="#000"
                />
                <Text style={styles.actionsText}>Invite Members</Text>
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
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.container, styles.createChamaForm]}>
          <View>
            <Text style={styles.notice}>
              You are about to start a chama on Chama Smart. Please note that
              you and other members of the chama will be required to operate the
              chama in accordance to the terms and conditions of the app. If you
              agree to these terms and conditions, please feel the form below to
              get started your chama.
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
                {loading ? "Setting up chama..." : "Start Chama"}
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
      )}
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
    borderRadius: 20,
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
    backgroundColor: "#4fb448",
    borderRadius: 20,
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
    color: "#4fb448",
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
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
    flexDirection: "row",
  },

  actionsText: {
    marginHorizontal: 10,
  },
});

/**
 * enhance rather than supplant the existing financial system
 */
