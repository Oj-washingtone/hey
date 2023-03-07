import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

export default function HomeScreen() {
  const user = useAuthentication();
  const auth = getAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Welcome {user?.email}</Text>
      <TouchableOpacity
        style={styles.tempLogoutBtn}
        onPress={() => signOut(auth)}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
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

  tempLogoutBtn: {
    backgroundColor: "#4fb448",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
});
