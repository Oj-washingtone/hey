import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  getDocs,
  setDoc,
  get,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, getIdToken, signOut } from "firebase/auth";

export default function JoinChamaScreen({ navigation, route }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;

  const [loading, setLoading] = useState(false);

  const [chamaDetails, setChamaDetails] = useState({
    chamaCode: "",
    chamaPassword: "",
    error: "",
    success: "",
  });

  const joinChama = async () => {
    // check for empty fields
    if (chamaDetails.chamaCode === "" || chamaDetails.chamaPassword === "") {
      setChamaDetails({
        ...chamaDetails,
        error: "Please fill in all the required fields",
      });
      return;
    }

    // check if chamacode and password is valid
    setLoading(true);
    const chamaRef = doc(db, "chamas", chamaDetails.chamaCode);
    const chamaDoc = await getDoc(chamaRef);

    if (!chamaDoc.exists()) {
      setChamaDetails({
        ...chamaDetails,
        error: "Invalid chama code or password",
      });

      setLoading(false);
      return;
    }

    const chamaData = chamaDoc.data();
    if (chamaData.chamaPassword !== chamaDetails.chamaPassword) {
      setChamaDetails({
        ...chamaDetails,
        error: "Invalid chama code or password",
      });

      setLoading(false);
      return;
    }

    // if valid, check if user is already a member of the chama
    if (chamaData.chamaMembers.includes(userId)) {
      setChamaDetails({
        ...chamaDetails,
        error: "You are already a member of this chama",
      });

      setLoading(false);
      return;
    }

    // check if user is already in the wait list
    if (chamaData.memberWaitList.includes(userId)) {
      setChamaDetails({
        ...chamaDetails,
        success: "",
        error:
          "You are already in the wait list for this chama, you will be notified as soon as the chama approves your membership request",
      });

      setLoading(false);
      return;
    }

    // if all is well, add user to chama wait list
    await updateDoc(chamaRef, {
      memberWaitList: arrayUnion(userId),
    });
    setLoading(false);

    // set set success message and if any error message remove them
    setChamaDetails({
      ...chamaDetails,
      success:
        "You have been added to the wait list for this chama, you will be notified as soon as the chama approves your membership request",
      error: "",
    });

    // send message to this chama about the user wishing to join the chama
    const messageRef = doc(db, "chamas", chamaDetails.chamaCode.toString());
    try {
      await updateDoc(messageRef, {
        messages: arrayUnion({
          message: `${route.params.userName} is requesting to join this chama`,
          for: userId,
          type: "membership",
          senderID: "Chama Smart",
          senderName: "Chama Smart",
          timestamp: new Date(),
          id: Math.random().toString(36).substring(7),
        }),
      });

      setMessage("");
      setShowOptions(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {!!chamaDetails.error && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{chamaDetails.error}</Text>
        </View>
      )}

      {!!chamaDetails.success && (
        <View style={styles.success}>
          <Text style={styles.successMessage}>{chamaDetails.success}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter Chama code"
        keyboardType="numeric"
        onChangeText={(text) =>
          setChamaDetails({ ...chamaDetails, chamaCode: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Chama Password"
        secureTextEntry={true}
        onChangeText={(text) =>
          setChamaDetails({ ...chamaDetails, chamaPassword: text })
        }
      />
      <Text style={styles.terms}>
        By joining this chama, I agree to their {" terms and conditions"} as
        well as the terms and condition of the app
      </Text>

      <TouchableOpacity style={styles.joinChamaBtn} onPress={joinChama}>
        {loading && <ActivityIndicator color="#fff" />}
        <Text style={styles.btnText}>
          {loading ? "Please wait..." : "Join Chama"}
        </Text>
      </TouchableOpacity>

      <View style={styles.additional}>
        <Text style={[styles.startChamaText]}>
          Your chama has not been created ?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Start Chama")}>
          <Text style={[styles.startChamaText, styles.startChamaBtn]}>
            Create a Chama
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  input: {
    width: "80%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  joinChamaBtn: {
    flexDirection: "row",
    width: "80%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#ed4746",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  terms: {
    width: "80%",
    marginVertical: 20,
  },

  error: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 20,
    width: "80%",
    borderRadius: 20,
    marginBottom: 10,
  },

  errorMessage: {
    color: "#721c24",
    textAlign: "center",
  },

  additional: {
    flexDirection: "row",
    marginTop: 20,
    width: "80%",
  },

  startChamaText: {
    fontSize: 16,
  },

  startChamaBtn: {
    color: "#ed4746",
    fontWeight: "bold",
    marginLeft: 5,
  },

  success: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 20,
    width: "80%",
    borderRadius: 20,
    marginBottom: 10,
  },

  successMessage: {
    color: "#155724",
    textAlign: "center",
  },
});
