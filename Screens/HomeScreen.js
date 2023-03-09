// import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";

// bottom sheet library
// import {
//   BottomSheetModal,
//   BottomSheetModalProvider,
// } from "@gorhom/bottom-sheet";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

import Ioicons from "react-native-vector-icons/Ionicons";

// screens

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
  const user = useAuthentication();
  const auth = getAuth();

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
  });

  const [chamaRooms, setChamaRooms] = useState([
    {
      id: "1",
      chamaName: "Work Chama",
      chamaDP: require("../assets/chamaDps/logo.png"),
      totalMethers: 10,
      chamaBalance: 1000,
      recentActivity: "Hello",
      messageAt: "08:00 am",
      totalUnreadMessages: 10,
    },
    {
      id: "2",
      chamaName: "Informatics Class",
      chamaDP: require("../assets/chamaDps/logo2.png"),
      totalMethers: 10,
      chamaBalance: 1000,
      recentActivity: "Hello",
      messageAt: "10:00 am",
      totalUnreadMessages: 5,
    },
    {
      id: "3",
      chamaName: "Family",
      chamaDP: require("../assets/chamaDps/logo3.jpg"),
      totalMethers: 10,
      chamaBalance: 1000,
      recentActivity: "Hello",
      messageAt: "12:00 am",
      totalUnreadMessages: 3,
    },
    {
      id: "4",
      chamaName: "Friends",
      chamaDP: require("../assets/chamaDps/logo4.png"),
      totalMethers: 10,
      chamaBalance: 1000,
      recentActivity: "Hello",
      messageAt: "11:00 am",
      totalUnreadMessages: 0,
    },
    {
      id: "5",
      chamaName: "Friends",
      chamaDP: require("../assets/chamaDps/logo.png"),
      totalMethers: 10,
      chamaBalance: 1000,
      recentActivity: "Hello",
      messageAt: "09:00 am",
      totalUnreadMessages: 30,
    },
  ]);

  const openChama = (chamaDetails) => {
    navigation.navigate("Messaging UI", chamaDetails);
  };

  // const bottomSheetModalRef = useRef(null);
  // // amount of screen that we want bottom sheet to contain
  // const snapPoint = ["48%"];

  // const openBottonSheet = () => {
  //   bottomSheetModalRef.current?.present();
  //   console.log("Opening bottom sheet");
  // };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* 4 */}
      <View style={styles.top}>
        <View>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.nameUser}>Washingtone Jalang'O</Text>
        </View>
        <View style={styles.profileImageSection}>
          <Image
            style={styles.profileImage}
            source={require("../assets/profilePictures/pp1.jpg")}
          />
        </View>
      </View>
      {/* 3 */}
      <View style={styles.wallet}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>My Wallet</Text>
        </View>
        <View style={styles.walletBalance}>
          <Text style={styles.walletBallanceTitle}>Balance</Text>
          <Text style={styles.walletAmount}>Ksh. 0.00</Text>
        </View>
      </View>

      {/*2 Wallet action buttons */}
      <View style={styles.walletActions}>
        <TouchableOpacity
          style={styles.walletActionButton}
          onPress={() => navigation.navigate("Deposit")}
        >
          <Ioicons name="add-circle" size={24} color="#bd0832" />
          <Text style={styles.walletActionButtonText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.walletActionButton}
          onPress={() => navigation.navigate("Withdraw")}
        >
          <Ioicons name="arrow-down-circle" size={24} color="#bd0832" />
          <Text style={styles.walletActionButtonText}>Witdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.walletActionButton}
          // onPress={openBottonSheet}
        >
          <Ioicons name="alarm" size={24} color="#bd0832" />
          <Text style={styles.walletActionButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
      {/* 1 */}
      <View style={styles.chamaSection}>
        <Text style={styles.title}>My chamas</Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={chamaRooms}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chama}
              onPress={() => openChama(item)}
            >
              <View style={styles.chamaImageSection}>
                <Image style={styles.chamaDP} source={item.chamaDP} />
              </View>

              <View style={styles.MoreOnChama}>
                <View style={styles.chamaDetails}>
                  <Text style={styles.chamaName}>{item.chamaName}</Text>
                  <Text style={styles.messageAt}>{item.messageAt}</Text>
                </View>
                <View style={styles.chamaRecentMessages}>
                  <Text>Recent message</Text>

                  {item.totalUnreadMessages > 0 && (
                    <Text style={styles.messageCounter}>
                      {item.totalUnreadMessages}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* <Text>Welcome {user?.email}</Text> */}

      <TouchableOpacity style={styles.floatingActionButton}>
        <Ioicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    // paddingTop: 60,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
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
    backgroundColor: "#f2f3f5",
    borderColor: "#f2f3f5",
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60 / 2,
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

  wallet: {
    flex: 1,
    backgroundColor: "#f2f3f5",
    borderRadius: 10,
    marginTop: 50,
    padding: 20,
  },

  walletHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  walletTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // color: "#fff",
    marginVertical: 20,
  },

  walletBalance: {
    padding: 10,
  },

  walletBallanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#fff",
  },

  walletAmount: {
    fontSize: 40,
    fontWeight: "bold",
    // color: "#fff",
  },

  walletActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },

  walletActionButton: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  chamaSection: {
    flex: 2.3,
    marginTop: 50,
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 20,
  },

  chama: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: "100%",
  },

  chamaImageSection: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "#f2f3f5",
    borderColor: "#f2f3f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  chamaDP: {
    width: "100%",
    height: "100%",
    borderRadius: 50 / 2,
  },

  chamaDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth - 130,
  },

  chamaName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  messageAt: {
    color: "gray",
  },

  chamaRecentMessages: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  messageCounter: {
    backgroundColor: "#bd0832",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
});

/**
 * Data mining class notes
 * Slicing and dicing, and pivoting data -  rotate the data and get what you want from it
 *
 * Designing the data warehouse
 * View in designing the data warehouse (Functional storage in data warehouse)
 *
 * Data warehouse process
 * Top down - overal designing and planning first then you move to the details
 * Bottom up starts with experiments and prototypes and then you move to the details
 * The above two can be sumarised into waterfall
 * ETLR - Extract, Transform, Load, Report
 * Olap Engine - Online Analytical Processing engine - used to query the data warehouse
 *
 * Several data mats put together gives you a data warehouse
 * Data mart - a subset of the data warehouse - you chaeck if they are independent of each other or depends on each other
 *
 * Data warehouse is a collection of data marts
 * Data mart is a collection of data mats
 * Data mat is a collection of data cubes
 * Data cube is a collection of data cells
 * Data cell is a collection of data points
 * Data point is a collection of data
 * Data is a collection of facts
 * Facts are the data
 *
 * Recommended approach in modeling data warehouse
 * 1. Start with the business process
 * 2. Identify the data sources
 * 3. Identify the data marts
 * 4. Identify the data cubes
 * 5. Identify the data cells
 * 6. Identify the data points
 * 7. Identify the data
 * 8. Identify the facts
 *
 *
 * Enterprise Data Warehouse /  multi tire data warehouse - 3 tier data warehouse
 * 1. Data warehouse
 * 2. Data mart
 * 3. Data mat
 * 4. Data cube
 * 5. Data cell
 * 6. Data point
 * 7. Data
 * 8. Facts
 *
 * OLAP SERVER ARCHITECTURE
 * Relational Olap Server - ROLAP
 * Multidimensional Olap Server - MOLAP
 * Hybrid Olap Server - HOLAP
 *
 * Apex cuboid, we do aggregation on the data - surmising the data at that level
 *
 *
 * Metadata repository - stores the metadata - data that describes the data
 * There are the following kinds
 * 1. Data dictionary - stores the metadata about the data warehouse
 * 2. Data catalog - stores the metadata about the data warehouse
 * 3. Data warehouse schema - stores the metadata about the data warehouse
 * 4. Data warehouse dictionary - stores the metadata about the data warehouse
 * 5. Data warehouse catalog - stores the metadata about the data warehouse
 * 6. Data warehouse metadata - stores the metadata about the data warehouse
 * 7. Data warehouse metadata repository - stores the metadata about the data warehouse
 *
 * Moving from OLAP to OLAM
 * OLAM - Online Analytical Mining
 *
 *  one does analysis and the other does mining
 *
 *
 */
