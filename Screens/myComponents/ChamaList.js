import { db } from "../../config/firebase";
import {
  collection,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  get,
} from "firebase/firestore";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Ioicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

export default function ChamaList(props) {
  const userId = props.userId;
  const userName = props.userName;

  const navigation = useNavigation();

  const [chamaRooms, setChamaRooms] = useState(undefined);

  // load chamas from firestore where this user is a chamaMember
  useEffect(() => {
    const q = query(
      collection(db, "chamas"),
      where("chamaMembers", "array-contains", userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chamaRooms = [];
      querySnapshot.forEach((doc) => {
        chamaRooms.push(doc.data());
      });
      setChamaRooms(chamaRooms);
    });
    return () => unsubscribe();
  }, [userId]);

  const openChama = (chamaDetails) => {
    navigation.navigate("Chama", {
      chamaDetails: chamaDetails,
      userName: userName,
    });
  };

  const renderChamaRooms = ({ item }) => (
    <TouchableOpacity style={styles.chama} onPress={() => openChama(item)}>
      <View style={styles.chamaDPsection}>
        {item.chamaDP ? (
          <Ioicons name="wallet" size={18} color="#D03F9B" />
        ) : (
          <Image
            source={require("./../../assets/chamaDps/logo2.png")}
            style={styles.chamaImage}
          />
        )}
      </View>

      <View style={styles.chamaDetails}>
        <View style={styles.chamaNameandMessageTime}>
          <Text style={styles.chamaName}>{item.chamaName}</Text>
          <Text>10: 30am</Text>
        </View>
        <View style={styles.messageAndCounterWraper}>
          <Text>This is the latest message to come in</Text>
          <Text style={styles.unreadMessageCounter}>1</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.chamaList}>
      {/* Search input */}
      <View style={styles.searchInput}>
        <Ioicons name="search" size={20} color="gray" />
        <TextInput
          cursorColor={"gray"}
          placeholder="Search chama"
          style={styles.searchInputText}
        />
      </View>
      <FlatList
        data={chamaRooms}
        renderItem={renderChamaRooms}
        keyExtractor={(item) => item.chamaCode.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chamaSection: {
    flex: 2.3,
    marginTop: 50,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 20,
  },

  chama: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f2f3f5",
  },

  chamaDPsection: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    backgroundColor: "#f2f3f5",
    borderColor: "#f2f3f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  chamaDP: {
    width: "100%",
    height: "100%",
    borderRadius: 55 / 2,
  },

  chamaDetails: {
    backgroundColor: "#fff",
    width: screenWidth - 120,
  },

  chamaNameandMessageTime: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  chamaName: {
    fontSize: 14,
    fontWeight: "bold",
  },

  chamaList: {
    flex: 1,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },

  searchInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f3f5",
    borderRadius: 5,
    padding: 10,
    marginBottom: 30,
    // elevation: 3,
  },

  searchInputText: {
    marginLeft: 10,
    width: "90%",
  },

  messageAndCounterWraper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  unreadMessageCounter: {
    backgroundColor: "#04c765",
    color: "#fff",
    borderRadius: 20,
    height: 15,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    paddingHorizontal: 5,
    fontWeight: "bold",
  },

  chamaImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    resizeMode: "cover",
  },
});
