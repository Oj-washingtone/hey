import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const gotoLogin = () => {
    navigation.navigate("Login");
  };

  // create user
  function CreateUser() {
    // ... do authentication stuff here
    // ... create user in firestore
    console.log("Creating user");
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Text style={[styles.logoText]}>Chama</Text>
        <Text style={[styles.logoText, styles.logoText2]}>Smart</Text>
      </View>

      <TextInput
        style={styles.inputField}
        placeholder="Full name"
        cursorColor="gray"
        value={fullName}
        onChangeText={(fullName) => setFullName(fullName)}
      />
      <TextInput
        style={styles.inputField}
        placeholder="ID number or passport"
        cursorColor="gray"
        value={idNumber}
        onChangeText={(idNumber) => setIdNumber(idNumber)}
      />

      <TextInput
        style={styles.inputField}
        placeholder="Email address"
        cursorColor="gray"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        style={styles.inputField}
        placeholder="Phone number"
        cursorColor="gray"
        value={phoneNumber}
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Password"
        secureTextEntry
        cursorColor="gray"
        value={password}
        onChangeText={(password) => setPassword(password)}
      />

      <TextInput
        style={styles.inputField}
        placeholder="Confirm password"
        secureTextEntry
        cursorColor="gray"
        value={confirmPassword}
        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
      />

      <View style={styles.termsCaution}>
        <Text>
          By registering, you agree to the terms and conditions of service
        </Text>
        <TouchableOpacity>
          <Text style={styles.termsLink}>terms and conditions of service</Text>
        </TouchableOpacity>
      </View>

      {/* Sign up Btn */}
      <TouchableOpacity
        style={styles.loginBtn}
        activeOpacity={0.5}
        onPress={CreateUser}
      >
        <Text style={styles.signupBtnText}>Sign up</Text>
      </TouchableOpacity>
      <View style={styles.promptLogin}>
        <Text style={styles.promptLoginText}>Already have an account?</Text>
        <TouchableOpacity style={styles.loginRedirect} onPress={gotoLogin}>
          <Text style={styles.loginRedirectText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 60,
  },

  logoText: {
    fontSize: 25,
    fontWeight: "bold",
  },

  logoText2: {
    color: "#4fb448",
  },

  inputField: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 10,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 20,
    backgroundColor: "#4fb448",
    padding: 7,
    marginTop: 20,
    alignItems: "center",
  },
  signupBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  promptLogin: {
    display: "flex",
    flexDirection: "row",
    marginTop: 60,
  },
  promptLoginText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
  },

  loginRedirect: {
    marginLeft: 10,
  },
  loginRedirectText: {
    fontWeight: "bold",
    color: "#4fb448",
    fontSize: 15,
  },

  termsCaution: {
    width: "80%",
    margin: 15,
  },
  termsLink: {
    marginTop: 10,
    color: "#4fb448",
  },
});
