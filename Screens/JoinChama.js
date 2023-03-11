import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

export default function JoinChamaScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [chamaDetails, setChamaDetails] = useState({
    chamaCode: "",
    chamaPassword: "",
    error: "",
  });

  const joinChama = async () => {
    // check for empty fields
    if (chamaDetails.chamaCode === "" || chamaDetails.chamaPassword === "") {
      setChamaDetails({
        ...chamaDetails,
        error: "Please fill in all the required fields",
      });

      return;
    }

    // check if chama code is valid
    // check if chama password is valid
    // check if user is already a member of the chama
    // if all is well, add user to chama
  };
  return (
    <View style={styles.container}>
      {!!chamaDetails.error && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{chamaDetails.error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter Chama code"
        keyboardType="numeric"
        onChangeText={(text) =>
          setChamaDetails({ ...chamaDetails, chamaCode: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Chama Password"
        secureTextEntry={true}
        onChangeText={(text) =>
          setChamaDetails({ ...chamaDetails, chamaPassword: text })
        }
      />
      <Text style={styles.terms}>
        By joining this chama, I agree to their {" terms and conditions"} as
        well as the terms and condition of the app
      </Text>

      <TouchableOpacity style={styles.joinChamaBtn} onPress={joinChama}>
        {loading && <ActivityIndicator color="#fff" />}
        <Text style={styles.btnText}>
          {loading ? "Please wait..." : "Join Chama"}
        </Text>
      </TouchableOpacity>

      <View style={styles.additional}>
        <Text style={[styles.startChamaText]}>
          Your chama has not been created ?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Start Chama")}>
          <Text style={[styles.startChamaText, styles.startChamaBtn]}>
            Join the Chama
          </Text>
        </TouchableOpacity>
      </View>
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

  input: {
    width: "80%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  joinChamaBtn: {
    flexDirection: "row",
    width: "80%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#4fb448",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  terms: {
    width: "80%",
    marginVertical: 20,
  },

  error: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 20,
    width: "80%",
    borderRadius: 20,
    marginBottom: 10,
  },

  errorMessage: {
    color: "#721c24",
    textAlign: "center",
  },

  additional: {
    flexDirection: "row",
    marginTop: 20,
    width: "80%",
  },

  startChamaText: {
    fontSize: 16,
  },

  startChamaBtn: {
    color: "#4fb448",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
