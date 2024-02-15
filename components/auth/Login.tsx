import { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddress } from "@thirdweb-dev/react-native";

import { TokenContext } from "../context/TokenContext";
import { UserContext } from "../context/UserContext";
import { UserIdContext } from "../context/UserIdContext";
import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomTextInput from "../customs/CustomTextInput";
import CustomGradientButton from "../customs/CustomGradientButton";
import CustomText from "../customs/CustomText";
import useLoading from "../hooks/useLoading";
import Circle from "../SVGComponents/Circle";
import Eyes from "../SVGComponents/Eyes";

import { api } from "../utils/api";

const Login = () => {
  const [password, setPassword] = useState("");
  const { setUsername } = useContext(UserContext);
  const { setUserId } = useContext(UserIdContext);
  const { setTokens } = useContext(TokenContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Retrieves the user's connected wallet address using the useAddress hook.
  const userAddress = useAddress();
  const { isLoading, setLoading } = useLoading();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await api.post("/auth/get_token/", {
        wallet: userAddress,
        password,
      });
      setTokens({
        access: response.data.access,
        refresh: response.data.refresh,
      });
      const userDetailRes = await api.get("/user/user_detail/", {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });
      const userIdTemp = userDetailRes.data.id;
      setUserId(userIdTemp);
      setUsername(userDetailRes.data.username);
      setLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ProfileTab" }],
        })
      );
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        "Login Failed 😟",
        String(error.response.data.errorMessage[0])
      );
    }
  };

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <Circle />
        <View style={styles.inputContainer}>
          <Text style={styles.loginText}>Login</Text>
          <CustomConnectWallet />
          <View style={styles.passwordContainer}>
            <View>
              <CustomTextInput
                secureTextEntry={!passwordVisible}
                placeholder="Password"
                inputMode="text"
                value={password}
                onChangeText={setPassword}
              />
              <Eyes
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Email Confirmation")}
              style={{ marginTop: 25 }}>
              <CustomText text="Forgot Password?" isItalic={false} />
            </TouchableOpacity>
          </View>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don`t you have account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Sign up")}>
              <CustomText text="Sign up!" isItalic={true} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.loginButtonContainer}>
          <TouchableOpacity onPress={handleLogin}>
            <CustomGradientButton text="Login" isLoading={isLoading} />
          </TouchableOpacity>
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
    justifyContent: "space-between",
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
    marginTop: 30,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  signupText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "700",
  },
  loginButtonContainer: {
    alignSelf: "flex-end",
  },
});

export default Login;
