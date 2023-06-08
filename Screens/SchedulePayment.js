import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, getIdToken, signOut } from "firebase/auth";

export default function ScheduleScreen() {
  const navigation = useNavigation();

  const user = useAuthentication();
  const auth = getAuth();
  const userId = user?.uid;

  const today = new Date();

  const schedule = [
    // { date: "2021-08-01", amount: 1000, status: "pending", chama: "Chama 1" },
    // { date: "2021-08-02", amount: 1000, status: "pending", chama: "Chama 1" },
    // { date: "2021-08-03", amount: 1000, status: "pending", chama: "Chama 1" },
  ];

  //   get day from date
  const getDay = (date) => {
    const day = date.split("-")[2];
    return day;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sections}>
        <Text style={styles.todayDate}>{today.toDateString()}</Text>
      </View>
      <View style={[styles.sections, styles.scheduleList]}>
        {/* Check if there are no schedules */}
        {schedule.length === 0 ? (
          <View style={styles.noScheduleContainer}>
            <Image
              source={require("./../assets/no_schedule.png")}
              style={styles.noScheduleImage}
            />
            <Text
              style={{
                color: "#000",
                textAlign: "center",
                fontSize: 15,
                marginTop: 20,
                width: "80%",
              }}
            >
              You have not scheduled any payment. Press the pluss button at the
              bottom to add a new schedule
            </Text>
          </View>
        ) : (
          <View style={styles.scheduleContainer}>
            <Text>My schedules</Text>
            <Text>Has schedule</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.floatingActionButtonWrapper}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Add Schedule Form", { userId })}
      >
        <LinearGradient
          colors={["#ed4746", "#FF8C00"]}
          start={[0.1, 0.1]}
          end={[1, 1]}
          style={styles.fab}
        >
          <MaterialCommunityIcons name="plus" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  todayDate: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 30,
  },

  scheduleList: {
    height: "100%",
  },

  noScheduleContainer: {
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },

  noScheduleImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  scheduleContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 20,
    borderColor: "#ccc",
  },

  floatingActionButtonWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },

  fab: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
