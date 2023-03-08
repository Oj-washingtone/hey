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
