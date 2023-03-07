import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export default function LoginScreen({ navigation }) {
  const [credentils, setCredentials] = useState({
    email: "",
    password: "",
    error: "",
  });

  const login = async () => {
    // check for empty input fields
    if (credentils.email === "" || credentils.password === "") {
      setCredentials({
        ...credentils,
        error: "Please fill in all fields then continue",
      });

      return;
    }

    // email to lowercase
    credentils.email = credentils.email.toLowerCase();

    try {
      await signInWithEmailAndPassword(
        auth,
        credentils.email,
        credentils.password
      );
    } catch {
      setCredentials({
        ...credentils,
        error: "Invalid credentials, please check and try again",
      });
    }
  };

  const gotoSignUp = () => {
    navigation.navigate("Sign up");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Text style={[styles.logoText]}>Chama</Text>
        <Text style={[styles.logoText, styles.logoText2]}>Smart</Text>
      </View>

      {!!credentils.error && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{credentils.error}</Text>
        </View>
      )}
      <TextInput
        style={styles.inputField}
        placeholder="Phone number"
        cursorColor="gray"
        onChangeText={(text) => setCredentials({ ...credentils, email: text })}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Password"
        secureTextEntry
        cursorColor="gray"
        onChangeText={(text) =>
          setCredentials({ ...credentils, password: text })
        }
      />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Btn */}
      <TouchableOpacity
        style={styles.loginBtn}
        activeOpacity={0.5}
        onPress={login}
      >
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.promptSignup}>
        <Text style={styles.promptSignupText}>Don't have an account?</Text>
        <TouchableOpacity style={styles.signupRedirect} onPress={gotoSignUp}>
          <Text style={styles.signupRedirectText}>Sign up</Text>
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
  loginBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  forgotPassword: {
    margin: 10,
    color: "#217ffb",
    fontWeight: "bold",
  },

  promptSignup: {
    display: "flex",
    flexDirection: "row",
    marginTop: 60,
  },
  promptSignupText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
  },

  signupRedirect: {
    marginLeft: 10,
  },
  signupRedirectText: {
    fontWeight: "bold",
    color: "#4fb448",
    fontSize: 15,
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
  },
});
