import { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddress } from "@thirdweb-dev/react-native";

import { TokenContext } from "../context/TokenContext";
import { UserContext } from "../context/UserContext";
import { UserIdContext } from "../context/UserIdContext";
import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomTextInput from "../customs/CustomTextInput";
import CustomGradientButton from "../customs/CustomGradientButton";
import useLoading from "../hooks/useLoading";
import Circle from "../SVGComponents/Circle";
import CustomText from "../customs/CustomText";
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
      console.log(error);
      setLoading(false);
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
            <CustomTextInput
              secureTextEntry
              placeholder="Password"
              inputMode="text"
              value={password}
              onChangeText={setPassword}
            />
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
    width: "100%",
    marginTop: 30,
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
  loginButtonContainer: {
    alignSelf: "flex-end",
  },
});

export default Login;
