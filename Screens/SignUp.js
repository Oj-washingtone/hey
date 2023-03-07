import { StatusBar } from "expo-status-bar";
// import icons from ionicons
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const auth = getAuth();

export default function SignUpScreen({ navigation }) {
  const [credentials, setCredentials] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const CreateUser = async () => {
    // check for empty values
    if (
      credentials.fullName === "" ||
      credentials.idNumber === "" ||
      credentials.email === "" ||
      credentials.phoneNumber === "" ||
      credentials.password === "" ||
      credentials.confirmPassword === ""
    ) {
      setCredentials({
        ...credentials,
        error: "Please fill in all fields then continue",
      });

      return;
    }

    // check for valid email
    if (!credentials.email.includes("@")) {
      setCredentials({
        ...credentials,
        error: "Please enter a valid email address",
      });

      return;
    }

    // check for valid phone number
    if (credentials.phoneNumber.length < 10) {
      setCredentials({
        ...credentials,
        error: "Please enter a valid phone number",
      });

      return;
    }

    // check if passwords are the same
    if (credentials.password !== credentials.confirmPassword) {
      setCredentials({
        ...credentials,
        error: "Passwords do not match",
      });

      return;
    }

    // passwrd strength
    if (credentials.password.length < 6) {
      setCredentials({
        ...credentials,
        error: "Password must be at least 6 characters",
      });

      return;
    }

    // username and email to lowercase
    credentials.fullName = credentials.fullName.toLowerCase();
    credentials.email = credentials.email.toLowerCase();

    try {
      const addUser = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      if (addUser) {
        // get id of added user
        const userId = addUser.user.uid;

        // save user details to firestore
        try {
          const docRef = await addDoc(collection(db, "users"), {
            userId: userId,
            fullName: credentials.fullName,
            idNumber: credentials.idNumber,
            phoneNumber: credentials.phoneNumber,
          });
        } catch {
          setCredentials({
            ...credentials,
            error: "Error creating user",
          });
        }
      }

      // navigate to login screen
      navigation.navigate("Login");
    } catch {
      setCredentials({
        ...credentials,
        error: "Invalid credentials",
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Text style={[styles.logoText]}>Chama</Text>
        <Text style={[styles.logoText, styles.logoText2]}>Smart</Text>
      </View>

      {!!credentials.error && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{credentials.error}</Text>
        </View>
      )}

      <TextInput
        style={styles.inputField}
        placeholder="Full name"
        cursorColor="gray"
        value={credentials.fullName}
        onChangeText={(text) =>
          setCredentials({ ...credentials, fullName: text })
        }
        // leftIcon={<Ionicons name="person" size={24} color="black" />}
      />
      <TextInput
        style={styles.inputField}
        placeholder="ID number or passport"
        cursorColor="gray"
        value={credentials.idNumber}
        onChangeText={(number) =>
          setCredentials({ ...credentials, idNumber: number })
        }
        keyboardType="numeric"
      />

      <TextInput
        style={styles.inputField}
        placeholder="Email address"
        cursorColor="gray"
        value={credentials.email}
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
      />

      <TextInput
        style={styles.inputField}
        placeholder="Phone number"
        cursorColor="gray"
        value={credentials.phoneNumber}
        keyboardType="numeric"
        onChangeText={(number) =>
          setCredentials({ ...credentials, phoneNumber: number })
        }
      />
      <TextInput
        style={styles.inputField}
        placeholder="Password"
        secureTextEntry
        cursorColor="gray"
        value={credentials.password}
        onChangeText={(text) =>
          setCredentials({ ...credentials, password: text })
        }
      />

      <TextInput
        style={styles.inputField}
        placeholder="Confirm password"
        secureTextEntry
        cursorColor="gray"
        value={credentials.confirmPassword}
        onChangeText={(text) =>
          setCredentials({ ...credentials, confirmPassword: text })
        }
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
        <TouchableOpacity
          style={styles.loginRedirect}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
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

/**
 * Kaimosi university
 * Denzel Mwiti should call me
 */
