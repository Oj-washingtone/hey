import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "react-native-vector-icons";

export default function ChamaMemberList(props) {
  const navigation = useNavigation();

  const chamaMembers = props?.chamaMembers;

  const [chamaMembersDetails, setChamaMembersDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // get details of each member from users collection from their ids in chama members array
  const getChamaMembersNames = async () => {
    try {
      const memberPromises = chamaMembers.map((memberId) =>
        getDoc(doc(db, "users", memberId))
      );
      const memberSnapshots = await Promise.all(memberPromises);
      const memberDetails = memberSnapshots.map((snapshot) => snapshot.data());
      setChamaMembersDetails(memberDetails);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (chamaMembers && chamaMembers.length > 0) {
      setIsLoading(true);
      getChamaMembersNames();
    }
  }, [chamaMembers]);

  console.log(chamaMembersDetails);

  return (
    <View style={styles.headerContainer}>
      {isLoading ? (
        <Text>Loading members...</Text>
      ) : chamaMembers && chamaMembers.length > 0 ? (
        chamaMembersDetails.map((member) => (
          <View key={member.userId}>
            <View style={styles.memberLIstItem}>
              <View style={styles.memberDpWrapper}>
                {/* check id profilePicture" is empty */}
                {member.profilePicture === "" ? (
                  <MaterialCommunityIcons
                    name="account"
                    size={23}
                    color="#D23D74"
                  />
                ) : (
                  <Image
                    source={{ uri: member.profilePicture }}
                    style={styles.memberDP}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.mamberName}>
                  {member.fullName}{" "}
                  {member.role === "admin" && (
                    <Text style={{ color: "green" }}>Admin</Text>
                  )}
                </Text>
                <Text>{member.phoneNumber}</Text>
              </View>
              <View style={styles.financeStatus}>
                <View
                  style={[styles.statusDot, { backgroundColor: "#ccc" }]}
                ></View>
              </View>
            </View>
            {chamaMembers?.length > 10 && (
              <TouchableOpacity key={"jfjfkhth68tgo"}>
                <Text>View all {chamaMembers?.length} </Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text>Error fetching members.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  memberLIstItem: {
    paddingVertical: 10,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
  },

  memberDpWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f2f3f5",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  memberDP: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },

  memberInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  financeStatus: {
    marginLeft: "auto",
  },

  mamberName: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 3,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 7 / 2,
    marginRight: 5,
  },
});
