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
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import CryptoJS from "react-native-crypto-js";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const auth = getAuth();

export default function SignUpScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const [passwordHidden, setPasswordHidden] = useState(true);

  const CreateUser = async () => {
    Keyboard.dismiss();

    // check for empty values
    if (
      credentials.fullName === "" ||
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
      setLoading(true);
      const addUser = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      if (addUser) {
        // get id of added user
        const userId = addUser.user.uid;

        // generate account number for user
        const accountNumber = Math.floor(
          1000000000 + Math.random() * 9000000000
        );

        // create wallet for user
        const wallet = {
          id: accountNumber,
          type: "personal",
          currency: "KES",
          balance: 0,
          transactions: [],
          createdDate: new Date(),
          modifiedDate: new Date(),
          status: "active",
          accountNumber: accountNumber,
        };

        // ecrypt wallet

        const encryptedWallet = CryptoJS.AES.encrypt(
          JSON.stringify(wallet),
          userId
        ).toString();

        // console.log(encryptedWallet);

        // save user details to firestore
        try {
          const userRef = await doc(db, "users", userId);
          setDoc(userRef, {
            userId: userId,
            fullName: credentials.fullName,
            idNumber: credentials.idNumber,
            phoneNumber: credentials.phoneNumber,
            email: credentials.email,
            hasChama: false,
            profilePicture: "",
            wallet: encryptedWallet,
            scheduledTransactions: [],
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
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setCredentials({
          ...credentials,
          error: "Email is already taken, please use another email or login",
        });
      } else {
        setCredentials({
          ...credentials,
          error: "Error creating user, please try again later",
        });
      }
    }
  };

  const showPassword = () => {
    setPasswordHidden(!passwordHidden);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.signUpText}>Sign Up</Text>

      {!!credentials.error && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{credentials.error}</Text>
        </View>
      )}

      <View style={styles.formWrapper}>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color="gray"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Full name"
            cursorColor="gray"
            value={credentials.fullName}
            onChangeText={(text) =>
              setCredentials({ ...credentials, fullName: text })
            }
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentials, error: "" })}
          />
        </View>

        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color="gray"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Email address"
            cursorColor="gray"
            value={credentials.email}
            onChangeText={(text) =>
              setCredentials({ ...credentials, email: text })
            }
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentials, error: "" })}
          />
        </View>

        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={24}
            color="gray"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Mobile"
            cursorColor="gray"
            value={credentials.phoneNumber}
            keyboardType="numeric"
            onChangeText={(number) =>
              setCredentials({ ...credentials, phoneNumber: number })
            }
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentials, error: "" })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={24}
            color="gray"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Password"
            secureTextEntry={passwordHidden}
            cursorColor="gray"
            value={credentials.password}
            onChangeText={(text) =>
              setCredentials({ ...credentials, password: text })
            }
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentials, error: "" })}
          />

          <TouchableOpacity
            style={styles.passwordVisibility}
            onPress={showPassword}
          >
            {passwordHidden ? (
              <MaterialCommunityIcons
                name="eye-off"
                size={24}
                color="gray"
                style={styles.inputIcon}
              />
            ) : (
              <MaterialCommunityIcons
                name="eye"
                size={24}
                color="gray"
                style={styles.inputIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={24}
            color="gray"
            style={styles.inputIcon}
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
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentials, error: "" })}
          />
        </View>

        <View style={styles.termsCaution}>
          <Text>
            By registering, you agree to the terms and conditions of service
          </Text>
          <TouchableOpacity>
            <Text style={styles.termsLink}>
              terms and conditions of service
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          activeOpacity={0.5}
          onPress={CreateUser}
        >
          <LinearGradient
            colors={["#ed4746", "#A353BB"]}
            start={[0.1, 0.1]}
            end={[1, 1]}
            style={styles.btnBackground}
          >
            {loading && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.loginBtnText}>
              {loading ? "Please wait ..." : "Sign up"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Or login with google */}
        <View style={styles.withGoogleWrapper}>
          <View style={styles.orWrapper}>
            <View style={styles.orLine}></View>
            <Text style={styles.orText}>Or</Text>
            <View style={styles.orLine}></View>
          </View>

          <TouchableOpacity style={styles.googleBtn}>
            {/* Image og google from the assets folder */}
            <Image
              source={require("./../assets/googleIcon.png")}
              style={styles.googleBtnImage}
            />
            <Text style={styles.googleBtnText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.promptLogin}>
        <Text style={styles.promptLoginText}>Have an account?</Text>
        <TouchableOpacity
          style={styles.loginRedirect}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.loginRedirectText}>login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 50,
  },

  signUpArt: {
    width: "100%",
    height: "30%",
    resizeMode: "contain",
  },

  signUpText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 20,
  },

  formWrapper: {
    width: "100%",
    marginTop: 20,
  },

  inputWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    marginVertical: 10,
  },

  inputField: {
    width: "80%",
    marginLeft: 20,
  },

  btn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  btnBackground: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  withGoogleWrapper: {
    width: "100%",
    marginTop: 20,
  },

  orWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  orLine: {
    width: "45%",
    height: 1,
    backgroundColor: "#ccc",
  },

  orText: {
    marginHorizontal: 10,
    color: "#ccc",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  googleBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    backgroundColor: "#f2f3f5",
    padding: 10,
    borderRadius: 5,
  },

  googleBtnImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 10,
  },

  loginBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  promptLogin: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 50,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#ed4746",
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
    width: "100%",
  },
  errorMessage: {
    color: "red",
  },
});
