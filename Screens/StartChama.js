import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

// import ion icons
import { Ionicons } from "@expo/vector-icons";

export default function StartChamaScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [chamaDetails, setChamaDetails] = useState({
    chamaName: "",
    chamaDescription: "",
    error: "",
  });

  const startChama = async () => {
    // check for empty fields
    if (chamaDetails.chamaName === "" || chamaDetails.chamaDescription === "") {
      setChamaDetails({
        ...chamaDetails,
        error: "Pleas make sure to fill all the required details then continue",
      });

      return;
    }

    // gnereate uniquer 8 digits chama code
    const chamaWallet = Math.floor(10000000 + Math.random() * 90000000);
    console.log(chamaWallet);
  };

  return (
    <View style={styles.container}>
      <View>
        {/* <Ionicons name="ios-people" size={100} color="#000" /> */}
        <Text style={styles.notice}>
          You are about to start a chama on Chama Smart. Please note that you
          and other members of the chama will be required to operate the chama
          in accordance to the terms and conditions of the app. If you agree to
          these terms and conditions, please feel the form below to get started
          your chama.
        </Text>
      </View>
      <View style={styles.startChamaForm}>
        {!!chamaDetails.error && (
          <View style={styles.error}>
            <Text style={styles.errorMessage}>{chamaDetails.error}</Text>
          </View>
        )}

        <Text style={styles.title}>Name of the chama</Text>
        <TextInput
          style={styles.input}
          placeholder="Chama Name"
          onChangeText={(text) =>
            setChamaDetails({ ...chamaDetails, chamaName: text })
          }
        />
        <Text style={styles.title}>Chama Description</Text>
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Type something"
          multiline={true}
          onChangeText={(text) =>
            setChamaDetails({ ...chamaDetails, chamaDescription: text })
          }
        />

        <TouchableOpacity style={styles.startChamaBtn} onPress={startChama}>
          {loading && <ActivityIndicator color="#fff" />}
          <Text style={styles.btnText}>
            {loading ? "Setting up chama..." : "Start Chama"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.additional}>
        <Text style={[styles.joinChamaText]}>
          Your chama has already been created ?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Join Chama")}>
          <Text style={[styles.joinChamaText, styles.joinChamaBtn]}>
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  notice: {
    fontSize: 16,
    color: "#000",
    marginTop: 30,
  },

  startChamaForm: {
    width: "90%",
    marginVertical: 40,
  },

  input: {
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginBottom: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  description: {
    maxHeight: 100,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  startChamaBtn: {
    width: "100%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#4fb448",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  additional: {
    flexDirection: "row",
    width: "90%",
  },

  joinChamaText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "gray",
  },

  joinChamaBtn: {
    color: "#4fb448",
  },

  error: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 20,
    marginBottom: 10,
  },
  errorMessage: {
    color: "#721c24",
  },
});

/**
 * enhance rather than supplant the existing financial system
 */
