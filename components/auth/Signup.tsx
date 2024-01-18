import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react-native";
import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomGradientButton from "../customs/CustomGradientButton";

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Signup = () => {
  const [registered, setRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("1");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Retrieves the user's connected wallet address using the useAddress hook.
  const userAddress = useAddress();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await api.post("/user/register/", {
        username,
        password,
        timeZone: timezone,
        wallet: userAddress,
      });

      if (response.status === 200) {
        setRegistered(true);
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
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  /**
   * useEffect hook that navigates to the "ProfileTab" screen after a delay if the user is registered.
   * @param registered - A boolean indicating whether the user is registered.
   * @param navigation - The navigation object used to navigate between screens.
   * @returns A cleanup function that clears the timeout when the component unmounts.
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (registered) {
      timer = setTimeout(() => {
        navigation.navigate("ProfileTab");
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timer); // cleanup on unmount
  }, [registered, navigation]);

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
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B80DCA", "#4035CB"]}
            style={{
              marginBottom: 20, // 15px below the "Sign Up" text
              width: 302,
              height: 63,
              borderRadius: 10,
              padding: 3, // This will be the width of your border
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 10, // make sure this matches the borderRadius of the LinearGradient
                backgroundColor: "#D9D9D9", // or whatever your button's background color is
                justifyContent: "center", // Center the text vertically
                alignItems: "flex-start", // Center the text horizontally
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
                placeholder="Username"
                placeholderTextColor="#0C0C0C"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B80DCA", "#4035CB"]}
            style={{
              marginBottom: 20, // 15px below the "Sign Up" text
              width: 302,
              height: 63,
              borderRadius: 10,
              padding: 3, // This will be the width of your border
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 10, // make sure this matches the borderRadius of the LinearGradient
                backgroundColor: "#D9D9D9", // or whatever your button's background color is
                justifyContent: "center", // Center the text vertically
                alignItems: "flex-start", // Center the text horizontally
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  color: "#3D3939",
                  fontFamily: "Inter",
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: "600",
                  top: 20,
                }}>
                Timezone
              </Text>
              <Picker
                selectedValue={timezone}
                onValueChange={(itemValue, itemIndex) => setTimezone(itemValue)}
                style={styles.input}>
                <Picker.Item label="UTC+1" value="1" />
                <Picker.Item label="UTC+2" value="2" />
                <Picker.Item label="UTC+3" value="3" />
                <Picker.Item label="UTC+4" value="4" />
                <Picker.Item label="UTC+5" value="5" />
              </Picker>
            </View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B80DCA", "#4035CB"]}
            style={{
              marginBottom: 30,
              width: 302,
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
          <CustomConnectWallet style={{ width: 250 }} />
        </View>
        <View style={styles.signUpButtonContainer}>
          <TouchableOpacity onPress={handleRegister}>
            <CustomGradientButton text="Sign up" />
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
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
