import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";

import Ioicons from "react-native-vector-icons/Ionicons";

export default function EditProfile({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [currentDetails, setCurrentDetails] = useState(
    route.params.userDetails
  );
  const [userDetails, setUserDetails] = useState({});

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profilePicture}>
        {/* Check wether profilePicture is avaliable else render an icon */}
        {currentDetails.profilePicture ? (
          <Image source={{ uri: currentDetails.profilePicture }} />
        ) : (
          <Ioicons name="person-outline" size={60} color="black" />
        )}
      </TouchableOpacity>

      <View style={styles.basicEditableDetails}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          defaultValue={currentDetails.fullName}
          placeholder="Full name "
          onChangeText={(text) =>
            setUserDetails({ ...userDetails, phone: text })
          }
          leftIcon={<Ioicons name="person" size={24} color="black" />}
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          defaultValue={currentDetails.phoneNumber}
          placeholder="Phone number "
          onChangeText={(text) =>
            setUserDetails({ ...userDetails, phone: text })
          }
        />
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          defaultValue={currentDetails.email}
          placeholder="Email address"
          onChangeText={(text) =>
            setUserDetails({ ...userDetails, phone: text })
          }
        />

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7}>
          <Text style={styles.btnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 60,
  },

  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 150 / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 120 / 2,
  },

  basicEditableDetails: {
    width: "80%",
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },

  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 20,
  },
  label: {
    // fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  saveBtn: {
    width: "100%",
    height: 40,
    backgroundColor: "#ed4746",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
