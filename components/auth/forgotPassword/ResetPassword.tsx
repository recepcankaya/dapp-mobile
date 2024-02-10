/**
 * Component for resetting password.
 * This component allows the user to reset their password by entering a new password and confirming it.
 */
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import CustomGradientButton from "../../customs/CustomGradientButton";
import CustomTextInput from "../../customs/CustomTextInput";
import useLoading from "../../hooks/useLoading";
import { api } from "../../utils/api";

import Circle from "../../SVGComponents/Circle";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoading, setLoading } = useLoading();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSubmit = async () => {
    setLoading(true);

    if (password !== passwordConfirmation) {
      setErrorMessage(
        "The passwords you entered do not match. Please try again."
      );
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password should include at least 1 number and 1 letter. Please try again."
      );
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Password should be at least 8 characters. Please try again."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/user/password_reset_confirm/", {
        email: "erbat1@hotmail.com",
        password: password,
      });

      if (response.status === 200) {
        // Navigate to the "Login" page if the request is successful
        navigation.navigate("Login");
      } else {
        // Handle error
        console.error("Failed to reset password");
      }
    } catch (error) {
      // Handle error
      console.error(error);
      console.log((error as any).response);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Circle />
      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Reset Password</Text>
        <CustomTextInput
          placeholder=""
          secureTextEntry={true}
          inputMode="text"
          value={password}
          onChangeText={setPassword}
        />
        <CustomTextInput
          placeholder=""
          secureTextEntry={true}
          inputMode="text"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
        {errorMessage && (
          <Text style={{ color: "#B80DCA" }}>{errorMessage}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <CustomGradientButton text="Change" isLoading={isLoading} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    marginTop: 250,
    gap: 28,
  },
  heading: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "700",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
});

export default ResetPassword;
