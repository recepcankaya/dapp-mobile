import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomTextProps {
  style: any;
  children: React.ReactNode;
}

const CustomText = (props: CustomTextProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "custom-font": require("../assets/fonts/ZenDots-Regular.ttf"),
      });

      setFontLoaded(true);
    }

    loadFont();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text style={{ ...props.style, fontFamily: "custom-font" }}>
      {props.children}
    </Text>
  );
};

const Register = () => {
  const [registered, setRegistered] = useState(false);

  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const imageHeight = height - statusBarHeight;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("1");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (registered) {
      timer = setTimeout(() => {
        navigation.navigate("LoginInner");
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timer); // cleanup on unmount
  }, [registered, navigation]);

  const handleLogin = () => {
    setTimeout(() => {
      navigation.navigate("LoginInner");
    }, 3000);
  };
  const handleRegister = () => {
    api
      .post("/user/register/", {
        username: username,
        password: password,
        timeZone: timezone,
        email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          setRegistered(true);
          navigation.navigate("LoginInner");
        } else {
          // Handle other status codes here
        }
      })
      .catch((error) => {
        if (error.response.data.email[0] || error.response.data.username[0]) {
          Alert.alert(
            "Error",
            error.response.data.email[0] +
              "\n" +
              error.response.data.username[0]
          );
        } else {
          Alert.alert("Error", error.message);
        }
        console.log(error.response.data.email);
        setErrorMessage(error.message);
      });
  };

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <LinearGradient
          colors={["#9600BC", "#000936"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={styles.gradient}
          locations={[0.1885, 1.2]}>
          <ImageBackground
            source={require("../assets/Checks.png")}
            style={[
              styles.background,
              { height: imageHeight, marginTop: statusBarHeight },
            ]}>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <CustomText style={styles.inputText}>Email</CustomText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#fff"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputBox}>
                <CustomText style={styles.inputText}>Username</CustomText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#fff"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputBox}>
                <CustomText style={styles.inputText}>Password</CustomText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#fff"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputBox}>
                <CustomText style={styles.inputText}>TimeZone</CustomText>
                <Picker
                  selectedValue={timezone}
                  onValueChange={(itemValue, itemIndex) =>
                    setTimezone(itemValue)
                  }
                  style={styles.input}>
                  <Picker.Item label="UTC+1" value="1" />
                  <Picker.Item label="UTC+3" value="3" />
                  <Picker.Item label="UTC+2" value="2" />
                  <Picker.Item label="UTC+4" value="4" />
                  <Picker.Item label="UTC+5" value="5" />
                </Picker>
              </View>
              {registered ? (
                <View style={styles.buttonContainer}>
                  <CustomText style={styles.buttonText}>
                    Registering...
                  </CustomText>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}>
                    <CustomText style={styles.buttonText}>Register</CustomText>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <CustomText style={styles.buttonText}>Login</CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  inputBox: {
    width: 317,
    height: 90,
    borderRadius: 42,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  inputText: {
    color: "#000",
    fontFamily: "Zen Dots",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 317,
    height: 72,
    borderRadius: 42,
    backgroundColor: "#AD00D1",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Zen Dots",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Register;
