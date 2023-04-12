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
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import { StatusBar } from "expo-status-bar";
import { useRef, useState, createContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, getIdToken, signOut } from "firebase/auth";

import Ioicons from "react-native-vector-icons/Ionicons";

// components
import FloatingActionButton from "./myComponents/FloatingActionButton";
import Wallet from "./myComponents/Wallet";
import ChamaList from "./myComponents/ChamaList";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
  });

  const [isOnline, setIsOnline] = useState(false);

  // get details of this user from firestore
  useEffect(() => {
    const getUserDetails = async (userId) => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsOnline(true);
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        setIsOnline(false);
        console.log(error);
      }
    };

    if (userId) {
      getUserDetails(userId);
    }
  }, [userId]);

  //

  const handleJoinChama = () => {
    navigation.navigate("Join Chama", { userName: userDetails.fullName });
  };

  const handleStartChama = () => {
    navigation.navigate("Start Chama", {
      userId: userId,
      userName: userDetails.fullName,
    });
  };

  const openChama = (chamaDetails) => {
    navigation.navigate("Chama", { chamaDetails: chamaDetails });
  };

  // Navigate to deposit screen
  const handleDeposit = () => {
    navigation.navigate("Deposit", { userId: userId });
  };

  // navigate to withdrawals screen
  const handleWithdraw = () => {
    navigation.navigate("Withdraw", { userId: userId });
  };

  return (
    //
    <View style={styles.container}>
      <StatusBar style="auto" />
      {userDetails.fullName ? (
        <View style={styles.body}>
          <Wallet fullName={userDetails.fullName} userId={userId} />
          <View style={styles.walletActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.5}
              onPress={handleDeposit}
            >
              <Ioicons name="add" size={24} color="#000" />
              <Text>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.5}
              onPress={handleWithdraw}
            >
              <Ioicons name="download" size={24} color="#000" />
              <Text>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.5}>
              <Ioicons name="calendar" size={24} color="#000" />
              <Text>Schedule payments</Text>
            </TouchableOpacity>
          </View>
          <ChamaList
            navigate={navigation}
            handleOpenChama={openChama}
            userId={userId}
            userName={userDetails.fullName}
          />
          <FloatingActionButton
            onJoinChamaPress={handleJoinChama}
            onCreateChamaPress={handleStartChama}
            userName={userDetails.fullName}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#E83672" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  body: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    // backgroundColor: "#ed4746",
  },

  top: {
    height: 200,
    backgroundColor: "#ED4746",
    borderBottomLeftRadius: -40,
    borderBottomRightRadius: -40,

    // padding to make the content below the notch
    paddingTop: 50,
  },

  welcome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    marginTop: 5,
  },

  nameUser: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  profileImageSection: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50 / 2,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60 / 2,
  },

  walletActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: screenWidth - 40,
    marginTop: 40,
  },

  actionButton: {
    width: 80,
    height: 80,
    // padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  floatingActionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    backgroundColor: "#bd0832",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});
