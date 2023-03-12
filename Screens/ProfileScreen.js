import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

export default function UserAccount({ navigation }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;

  const [userDetails, setUserDetails] = useState({});
  const [chamaCount, setChamaCount] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      getUserDetails();
    }
  }, [userId]);

  // make first leter of name capital
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View style={styles.container}>
      {/* Show activity indicator while still loading user details */}
      {userDetails?.fullName === undefined ? (
        // Activity indicator plus text
        <View>
          <ActivityIndicator size="large" color="orange" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.profilePictureWrapper}>
            <Text>pp</Text>
          </View>
          <Text style={styles.userFullNAme}>{userDetails.fullName}</Text>
          <View style={styles.mainActions}>
            <TouchableOpacity
              style={[styles.btnMain]}
              onPress={() => navigation.navigate("Edit Profile")}
            >
              <Text>Edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnMain]}
              onPress={() => signOut(auth)}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.chamaCount}>0 chamas</Text>

          <View style={[styles.sectionsWrapper]}>
            <Text style={styles.title}>Account Information</Text>
            <Text style={styles.info}>Phone: {userDetails.phoneNumber}</Text>
            <Text style={styles.info}>
              ID number or Passport: {userDetails.idNumber}
            </Text>
            <Text style={styles.email}>Email: {user?.email}</Text>
          </View>
          <View style={[styles.sectionsWrapper]}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.settingsBtns}>
              <Text>Security settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsBtns}>
              <Text>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsBtns}>
              <Text>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsBtns}>
              <Text>Invite friens</Text>
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
    width: "100%",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  profilePictureWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },

  userFullNAme: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  email: {
    marginTop: 10,
  },

  mainActions: {
    width: "80%",
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between",
    // backgroundColor: "red",
  },

  btnMain: {
    width: 150,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#4fb448",
  },

  chamaCount: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 20,
  },

  info: {
    marginTop: 10,
  },

  sectionsWrapper: {
    marginTop: 30,
    width: "80%",
  },

  settingsBtns: {
    paddingVertical: 10,
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "gray",
  },
});
