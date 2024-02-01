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
import { LinearGradient } from "expo-linear-gradient";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomGradientButton from "../customs/CustomGradientButton";
import CustomTextInput from "../customs/CustomTextInput";
import useLoading from "../hooks/useLoading";
import { SignupFormSchema, SignupFormFields } from "./signupSchema";

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Signup = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Retrieves the user's connected wallet address using the useAddress hook.
  const userAddress = useAddress();
  const { isLoading, setLoading } = useLoading();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupFormFields>({
    resolver: zodResolver(SignupFormSchema),
  });

  const handleRegister: SubmitHandler<SignupFormFields> = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/user/register/", {
        ...data,
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
        Alert.alert(
          "Error",
          error.response.data.email?.[0] +
            "\n" +
            error.response.data.username?.[0]
        );
      } else {
        Alert.alert("Error", error.message);
      }
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
          style={styles.circle}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.signUpText}>Sign Up</Text>

          {/* @todo - REFACTOR CUSTOMTEXTINPUT COMPONENTS LATER */}
          <View>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => {
                return (
                  <CustomTextInput
                    placeholder="Username"
                    secureTextEntry={false}
                    inputMode="text"
                    value={value}
                    onChangeText={onChange}
                  />
                );
              }}
            />
            {errors.username && (
              <Text style={styles.errorMessages}>
                {errors.username.message}
              </Text>
            )}
          </View>
          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => {
                return (
                  <CustomTextInput
                    placeholder="Email"
                    secureTextEntry={false}
                    inputMode="email"
                    value={value}
                    onChangeText={onChange}
                  />
                );
              }}
            />
            {errors.email && (
              <Text style={styles.errorMessages}>{errors.email.message}</Text>
            )}
          </View>
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => {
                return (
                  <CustomTextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    inputMode="text"
                    value={value}
                    onChangeText={onChange}
                  />
                );
              }}
            />
            {errors.password && (
              <Text style={styles.errorMessages}>
                {errors.password.message}
              </Text>
            )}
          </View>
          <View style={{ width: 314 }}>
            <CustomConnectWallet style={{ width: "100%" }} />
          </View>
        </View>
        <View style={styles.signUpButtonContainer}>
          <TouchableOpacity onPress={handleSubmit(handleRegister)}>
            <CustomGradientButton text="Sign up" isLoading={isLoading} />
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
    justifyContent: "space-between",
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
    width: 650.637,
    height: 739.49,
    borderRadius: 739.49,
  },
  inputContainer: {
    alignItems: "center",
    marginTop: 190,
    gap: 28,
  },
  signUpText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  errorMessages: {
    color: "red",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  signUpButtonContainer: {
    alignSelf: "flex-end",
  },
});

export default Signup;
