import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function EditProfile({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(route.params.userDetails);

  console.log(userDetails);

  return (
    <View style={styles.container}>
      <Text>Edit Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
