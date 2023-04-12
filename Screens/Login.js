import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [credentils, setCredentials] = useState({
    email: "",
    password: "",
    error: "",
  });

  const [passwordHidden, setPasswordHidden] = useState(true);

  const login = async () => {
    // hide keyboard
    Keyboard.dismiss();
    // check for empty input fields
    if (credentils.email === "" || credentils.password === "") {
      setCredentials({
        ...credentils,
        error: "Please fill in all fields then continue",
      });
      // stop loading

      return;
    }

    // email to lowercase
    credentils.email = credentils.email.toLowerCase();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(
        auth,
        credentils.email,
        credentils.password
      );
    } catch {
      setCredentials({
        ...credentils,
        error: "* Invalid credentials, please check and try again",
      });

      setLoading(false);
    }
  };

  const gotoSignUp = () => {
    navigation.navigate("Sign up");
  };

  // show password
  const showPassword = () => {
    setPasswordHidden(!passwordHidden);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="auto" />

      <Image
        source={require("./../assets/login_art2.png")}
        style={styles.loginArt}
      />

      <Text style={styles.loginText}>Login</Text>

      {!!credentils.error && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{credentils.error}</Text>
        </View>
      )}
      <View style={styles.formWrapper}>
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
            onChangeText={(text) =>
              setCredentials({ ...credentils, email: text })
            }
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentils, error: "" })}
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
            onChangeText={(text) =>
              setCredentials({ ...credentils, password: text })
            }
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setCredentials({ ...credentils, error: "" })}
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
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        {/* Login Btn */}
        <TouchableOpacity
          style={styles.loginBtn}
          activeOpacity={0.5}
          onPress={login}
        >
          <LinearGradient
            colors={["#ed4746", "#A353BB"]}
            start={[0.1, 0.1]}
            end={[1, 1]}
            style={styles.btnBackground}
          >
            {loading && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.loginBtnText}>
              {loading ? "Please wait ..." : "Login"}
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
            <Text style={styles.googleBtnText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.promptSignup}>
        <Text style={styles.promptSignupText}>New to brighter?</Text>
        <TouchableOpacity style={styles.signupRedirect} onPress={gotoSignUp}>
          <Text style={styles.signupRedirectText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 50,
    justifyContent: "center",
  },

  loginArt: {
    width: "100%",
    height: "30%",
    resizeMode: "contain",
    marginTop: 50,
  },

  loginText: {
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

  forgotPassword: {
    margin: 10,
    color: "#217ffb",
    fontWeight: "bold",
    textAlign: "right",
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

  promptSignup: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 50,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#ed4746",
    fontSize: 16,
  },
  error: {
    width: "100%",
    // marginBottom: 10,
  },
  errorMessage: {
    color: "red",
  },
});
