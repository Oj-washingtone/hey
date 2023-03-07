import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

import { db } from "../config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

// import icons
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// screens

export default function HomeScreen() {
  const user = useAuthentication();
  const auth = getAuth();

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
  });

  let data;

  const getUserDetails = async () => {
    await getDoc(doc(db, "users", user?.uid))
      .then((doc) => {
        if (doc.exists) {
          data = doc.data();
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  getUserDetails();

  console.log(data);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text>Welcome {user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
