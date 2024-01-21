import { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingViewBase,
  KeyboardAvoidingViewComponent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddress } from "@thirdweb-dev/react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import { TokenContext } from "../context/TokenContext";
import { UserContext } from "../context/UserContext";
import { UserIdContext } from "../context/UserIdContext";
import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomTextInput from "../customs/CustomTextInput";
import CustomGradientButton from "../customs/CustomGradientButton";
import useLoading from "../hooks/useLoading";

const { width, height } = Dimensions.get("window");

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Login = () => {
  const [password, setPassword] = useState("");
  const { setUsername } = useContext(UserContext);
  const { setUserId } = useContext(UserIdContext);
  const { setTokens } = useContext(TokenContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Retrieves the user's connected wallet address using the useAddress hook.
  const userAddress = useAddress();
  const { isLoading, setLoading } = useLoading();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await api.post("/auth/get_token/", {
        wallet: userAddress,
        password,
      });
      if (response.status === 200) {
        console.log(response.data);
        setTokens({
          access: response.data.access,
          refresh: response.data.refresh,
        });
        const userDetailRes = await api.get("/user/user_detail/", {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });
        if (userDetailRes.status === 200) {
          console.log(userDetailRes.data);
          const user_id_temp = userDetailRes.data.id;
          setUserId(user_id_temp);
          setUsername(userDetailRes.data.username);
        } else {
          Alert.alert("Error", "Failed to get user details");
        }
        navigation.navigate("ProfileTab");
      } else {
        Alert.alert("Error", "Login failed");
      }
      setLoading(false);
    } catch (error: any) {
      Alert.alert("Error", error);
      console.log(error)
      setLoading(false);
    }
  };
  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={[styles.container, { flex: 1 }]}>
        <KeyboardAvoidingView behavior="padding">
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
        </KeyboardAvoidingView>
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

        <View style={{ justifyContent: 'flex-end' }}>
          <View style={styles.loginButtonContainer}>
            <TouchableOpacity onPress={handleLogin}>
              <CustomGradientButton text="Login" isLoading={isLoading} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  inputContainer: {
    marginTop: 250,
    width: "80%",
  },
  loginText: {
    marginBottom: 25,
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
  loginButtonContainer: {
    right: -width / 3.5,  //fixed to right according to screen size
    bottom: height / 3.5,   //fixed to bottom according to screen size
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
