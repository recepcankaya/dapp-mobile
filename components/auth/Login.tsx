import { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddress } from "@thirdweb-dev/react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import { TokenContext } from "../context/TokenContext";
import CustomConnectWallet from "../customs/CustomConnectWallet";
import { UserContext } from "../context/UserContext";
import { UserIdContext } from "../context/UserIdContext";
import CustomTextInput from "../customs/CustomTextInput";
import CustomGradientButton from "../customs/CustomGradientButton";

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Login = () => {
  const { username, setUsername } = useContext(UserContext);
  const { user_id, setUserId } = useContext(UserIdContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { setTokens } = useContext(TokenContext);
  // Retrieves the user's connected wallet address using the useAddress hook.
  const userAddress = useAddress();

  const handleLogin = () => {
    api
      .post("/auth/get_token/", {
        wallet: userAddress,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          setLoggedIn(true);
          console.log(response.data);
          setTokens({
            access: response.data.access,
            refresh: response.data.refresh,
          });
          navigation.navigate("ProfileTab");
          api
            .get("/user/user_detail/", {
              headers: {
                Authorization: `Bearer ${response.data.access}`,
              },
            })
            .then((response1) => {
              if (response1.status === 200) {
                console.log(response1.data); // This will log the response data to the console
                //set user id response.data.id
                const user_id_temp = response1.data.id;

                setUserId(user_id_temp);
                setUsername(response1.data.username);
              } else {
                Alert.alert("Error", "Failed to get user details");
              }
            })
            .catch((error1) => {
              console.error(error1);
              Alert.alert(
                "Error",
                "An error occurred while trying to get user details"
              );
            });
          navigation.navigate("ProfileTab");
        } else {
          Alert.alert("Error", "Login failed");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
        setErrorMessage(error.message);
      });
  };
  /**
   * useEffect hook that navigates to the "Profile" screen after a delay if the user is registered.
   * @param registered - A boolean indicating whether the user is registered.
   * @param navigation - The navigation object used to navigate between screens.
   * @returns A cleanup function that clears the timeout when the component unmounts.
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loggedIn) {
      timer = setTimeout(() => {
        navigation.navigate("ProfileTab");
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timer); // cleanup on unmount
  }, [loggedIn, navigation]);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient
          colors={["#B80DCA", "#4035CB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.circle,
            { width: 650.637, height: 739.49, borderRadius: 739.49 },
          ]}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.loginText}>Login</Text>
          <CustomConnectWallet />
          <View style={styles.passwordContainer}>
            <CustomTextInput
              secureTextEntry
              placeholder="Password"
              inputMode="text"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("Email Confirmation")}>
              <MaskedView
                style={{ flexDirection: "row" }}
                maskElement={
                  <Text style={styles.forgotPasswordButton}>
                    Forgot Password?
                  </Text>
                }>
                <LinearGradient
                  colors={["#B80DCA", "#4035CB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <Text style={[styles.forgotPasswordButton, { opacity: 0 }]}>
                    Forgot Password?
                  </Text>
                </LinearGradient>
              </MaskedView>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don`t you have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign up")}>
            <MaskedView
              style={{ flexDirection: "row" }}
              maskElement={<Text style={styles.signupButton}>Sign up!</Text>}>
              <LinearGradient
                colors={["#B80DCA", "#4035CB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Text style={[styles.signupButton, { opacity: 0 }]}>
                  Sign up!
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </View>
        <View style={styles.loginButtonContainer}>
          <TouchableOpacity onPress={handleLogin}>
            <CustomGradientButton text="Login" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#050505",
  },
  circle: {
    transform: [{ rotate: "-179.736deg" }],
    borderWidth: 5,
    borderColor: "#B80DCA",
    backgroundColor: "solid",
    position: "absolute",
    top: -545,
    alignSelf: "center",
  },
  background: {
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  inputContainer: {
    marginTop: 250,
    width: "80%",
  },
  loginText: {
    marginBottom: 10,
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "700",
  },
  passwordContainer: {
    width: "100%",
    marginTop: 30,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 417,
    height: 72,
    borderRadius: 42,
    backgroundColor: "#AD00D1",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  signupText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "700",
  },
  signupButton: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
  },
  forgotPasswordButton: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 0,
    marginBottom: 25,
  },
  loginButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default Login;
