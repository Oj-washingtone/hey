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
        <View>
          <Text>Dasboard</Text>
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
});
