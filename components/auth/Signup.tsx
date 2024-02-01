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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomConnectWallet from "../customs/CustomConnectWallet";
import CustomGradientButton from "../customs/CustomGradientButton";
import CustomTextInput from "../customs/CustomTextInput";
import useLoading from "../hooks/useLoading";
import Circle from "../SVGComponents/Circle";
import { SignupFormSchema, SignupFormFields } from "./signupSchema";
import { api } from "../utils/api";

const inputArray = [
  {
    key: 0,
    name: "username",
    placeholder: "Username",
    secureTextEntry: false,
    inputMode: "text",
  },
  {
    key: 1,
    name: "email",
    placeholder: "Email",
    secureTextEntry: false,
    inputMode: "email",
  },
  {
    key: 2,
    name: "password",
    placeholder: "Password",
    secureTextEntry: true,
    inputMode: "text",
  },
];

type FieldName = "username" | "email" | "password";
type FieldInputMode =
  | "url"
  | "text"
  | "email"
  | "search"
  | "decimal"
  | "numeric"
  | "tel";

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
        <Circle />
        <View style={styles.inputContainer}>
          <Text style={styles.signUpText}>Sign Up</Text>

          {inputArray.map((item) => (
            <View key={item.key}>
              <Controller
                control={control}
                name={item.name as FieldName}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CustomTextInput
                      placeholder={item.placeholder}
                      secureTextEntry={item.secureTextEntry}
                      inputMode={item.inputMode as FieldInputMode}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors[item.name as FieldName] && (
                <Text style={styles.errorMessages}>
                  {errors[item.name as FieldName]?.message}
                </Text>
              )}
            </View>
          ))}

          <View style={{ width: 314 }}>
            <CustomConnectWallet style={{ width: "100%" }} />
            {!userAddress && (
              <Text style={styles.errorMessages}>
                You don't have a wallet connected
              </Text>
            )}
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
