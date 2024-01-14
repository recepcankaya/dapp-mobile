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

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const LoginInner = () => {
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
          setUsername(userAddress ?? "");
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
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#B80DCA", "#4035CB"]}
              style={{
                marginBottom: 30,
                height: 63,
                borderRadius: 10,
                padding: 3,
              }}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: "#D9D9D9",
                  justifyContent: "center",
                  paddingLeft: 10,
                }}>
                <Text
                  style={{
                    color: "#D9D9D9",
                    fontFamily: "Inter",
                    fontSize: 20,
                    fontStyle: "italic",
                    fontWeight: "600",
                  }}></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#0C0C0C"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>
            </LinearGradient>
          </View>
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don`t you have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("newSignUp")}>
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
            <Svg width="168" height="157" viewBox="0 0 177 157" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M109.119 6.28364C125.645 9.54071 136.874 23.7587 151.609 32.0213C167.73 41.0608 191.703 40.3053 199.769 57.1128C207.807 73.8619 191.716 92.3733 189.443 110.861C187.111 129.843 196.896 151.2 186.264 166.995C175.554 182.907 154.52 188.842 135.635 190.807C118.409 192.598 103.331 181.459 86.4893 177.372C68.4574 172.996 47.9926 177.249 33.1719 165.941C17.2693 153.808 5.09061 134.639 4.04704 114.473C3.02277 94.6792 18.9714 79.1193 27.7632 61.4214C36.1565 44.526 39.0109 23.3912 54.5136 12.8845C70.0737 2.33886 90.7526 2.66378 109.119 6.28364Z"
                fill="#050505"
                stroke="url(#gradient)"
                strokeWidth="7"
              />
              <Defs>
                <SvgLinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0%" stopColor="#B80DCA" />
                  <Stop offset="100%" stopColor="#4035CB" />
                </SvgLinearGradient>
              </Defs>
            </Svg>
            <MaskedView
              style={styles.loginButtonText}
              maskElement={
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: "Inter",
                    fontStyle: "italic",
                  }}>
                  Login
                </Text>
              }>
              <LinearGradient
                colors={["#B80DCA", "#4035CB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: "Inter",
                    fontStyle: "italic",
                    opacity: 0,
                  }}>
                  Login
                </Text>
              </LinearGradient>
            </MaskedView>
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
  loginButtonText: {
    fontFamily: "Inter",
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: "400",
    right: 30,
    bottom: 40,
    position: "absolute",
    zIndex: 1,
  },
});

export default LoginInner;
