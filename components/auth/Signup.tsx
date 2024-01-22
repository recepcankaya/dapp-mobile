import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useAddress } from "@thirdweb-dev/react-native";
import axios from "axios";

import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomGradientButton from "../customs/CustomGradientButton";
import CustomTextInput from "../customs/CustomTextInput";
import useLoading from "../hooks/useLoading";

const { width, height } = Dimensions.get("window");

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Retrieves the user's connected wallet address using the useAddress hook.
  const userAddress = useAddress();
  const { isLoading, setLoading } = useLoading();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await api.post("/user/register/", {
        username,
        password,
        email,
        wallet: userAddress,
      });

      if (response.status === 200) {
        navigation.navigate("Login");
      } else {
        // Handle other status codes here
      }
      setLoading(false);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        (error.response.data.email?.[0] || error.response.data.username?.[0])
      ) {
        console.log("error1");
        Alert.alert(
          "Error",
          error.response.data.email?.[0] +
          "\n" +
          error.response.data.username?.[0]
        );
      } else {
        console.log("error2");
        console.log(error.response);
        Alert.alert("Error", error.message);
      }
      console.log(error.response?.data?.email);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
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
          <Text style={styles.signUpText}>Sign Up</Text>
          <CustomTextInput
            placeholder="Username"
            secureTextEntry={false}
            inputMode="text"
            value={username}
            onChangeText={setUsername}
          />
          <CustomTextInput
            placeholder="Email"
            secureTextEntry={false}
            inputMode="email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomTextInput
            placeholder="Password"
            secureTextEntry={true}
            inputMode="text"
            value={password}
            onChangeText={setPassword}
          />
          <CustomConnectWallet style={{ width: 250 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.signUpButtonContainer}>
            <TouchableOpacity onPress={handleRegister}>
              <CustomGradientButton text="Sign up" isLoading={isLoading} />
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
    flexDirection: "column",
    alignItems: "center",
    marginTop: 190,
  },
  signUpText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  signUpButtonContainer: {
    right: -width / 3.5,  //fixed to right according to screen size
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
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
});

export default Signup;
