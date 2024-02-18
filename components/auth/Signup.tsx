import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  SafeAreaView,
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
import Eyes from "../SVGComponents/Eyes";

import { SignupFormSchema, SignupFormFields } from "./signupSchema";
import { api } from "../utils/api";
import {heightConstant, radiusConstant, widthConstant} from "../customs/CustomResponsiveScreen";

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
  {
    key: 3,
    name: "confirmPassword",
    placeholder: "Confirm Password",
    secureTextEntry: true,
    inputMode: "text",
  },
];

type FieldName = "username" | "email" | "password" | "confirmPassword";
type FieldInputMode =
  | "url"
  | "text"
  | "email"
  | "search"
  | "decimal"
  | "numeric"
  | "tel";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState<boolean>(false);
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
      setLoading(false);
      Alert.alert(
        "Registration Failed!",
        String(error.response.data.errorMessage[0])
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                    <View>
                      <CustomTextInput
                        placeholder={item.placeholder}
                        secureTextEntry={
                          item.name === "password" ||
                          item.name === "confirmPassword"
                            ? item.name === "password"
                              ? !passwordVisible
                              : !passwordConfirmationVisible
                            : false
                        }
                        inputMode={item.inputMode as FieldInputMode}
                        value={value}
                        onChangeText={onChange}
                      />
                      {item.name === "password" ? (
                        <Eyes
                          passwordVisible={passwordVisible}
                          setPasswordVisible={setPasswordVisible}
                        />
                      ) : item.name === "confirmPassword" ? (
                        <Eyes
                          passwordVisible={passwordConfirmationVisible}
                          setPasswordVisible={setPasswordConfirmationVisible}
                        />
                      ) : null}
                    </View>
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
          <View style={{ width: 314*widthConstant }}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    alignItems: "center",
    marginTop: 190*heightConstant,
    gap: 28*heightConstant, // gap weight den mı height dan mı ?
  },
  signUpText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25*radiusConstant,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 10*heightConstant,
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  errorMessages: {
    color: "red",
    alignSelf: "flex-start",
    marginTop: 10*heightConstant,
  },
  signUpButtonContainer: {
    marginTop: 40,
    alignSelf: "flex-end",
    right: -20*widthConstant,
  },
});

export default Signup;
