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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import CustomGradientButton from "../../customs/CustomGradientButton";
import CustomTextInput from "../../customs/CustomTextInput";
import useLoading from "../../hooks/useLoading";
import Circle from "../../SVGComponents/Circle";
import Eyes from "../../SVGComponents/Eyes";

import { api } from "../../utils/api";
import { useEmailStore } from "../../store/emailConfirmStore";

const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const email = useEmailStore((state) => state.email);
  const { isLoading, setLoading } = useLoading();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  /**
   * Checks the conditions for a valid password.
   *
   * @param psw - The password to be checked.
   * @param pswConf - The password confirmation to be checked.
   * @returns If there is an error return false, otherwise return true.
   */
  const checkConditions = (psw: string, pswConf: string): boolean => {
    let errorMessage = "";

    if (psw !== pswConf) {
      errorMessage = "Passwords do not match";
    } else if (psw.length < 8) {
      errorMessage = "Password must be at least 8 characters";
    } else if (!/[a-z]/i.test(psw) || !/\d/.test(psw)) {
      errorMessage = "Password must contain both number and character";
    }

    setError(errorMessage);

    return errorMessage ? false : true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const isValid = checkConditions(password, passwordConfirmation);
      if (!isValid) {
        setLoading(false);
        setError("");
        return;
      } else {
        await api.post("/user/password_reset_confirm/", {
          email: email,
          password: password,
        });
        setLoading(false);
        Alert.alert("Password resetted successfully");
        navigation.navigate("Login");
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        "Reset Password Failed!",
        error.response.data.errorMessage[0]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Circle />
      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Reset Password</Text>
        <View>
          <CustomTextInput
            placeholder="New Password"
            secureTextEntry={passwordVisible ? false : true}
            inputMode="text"
            value={password}
            onChangeText={setPassword}
          />
          <Eyes
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        </View>
        <View>
          <CustomTextInput
            placeholder="Confirm Password"
            secureTextEntry={passwordConfirmationVisible ? false : true}
            inputMode="text"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />
          <Eyes
            passwordVisible={passwordConfirmationVisible}
            setPasswordVisible={setPasswordConfirmationVisible}
          />
        </View>
        {error ? <Text style={styles.errorMessages}>{error}</Text> : null}
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
  errorMessages: {
    color: "red",
    alignSelf: "flex-start",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
});

export default ResetPassword;
