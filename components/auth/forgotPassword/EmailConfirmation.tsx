/**
 * Represents the Email Confirmation component.
 * This component allows the user to confirm their email address.
 */

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

import { useEmailStore } from "../../store/emailConfirmStore";
import { usePasswordTokenStore } from "../../store/passwordTokenStore";
import { api } from "../../utils/api";

const EmailConfirmation = () => {
  const email = useEmailStore((state) => state.email);
  const updateEmail = useEmailStore((state) => state.updateEmail);
  const updatePasswordToken = usePasswordTokenStore(
    (state) => state.updatePasswordToken
  );
  const { isLoading, setLoading } = useLoading();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.post("/user/password_reset/", {
        email: email,
      });
      updatePasswordToken(response.data.token);
      navigation.navigate("Reset Confirmation");
      setLoading(false);
    } catch (error: any) {
      Alert.alert("Email Confirmation Failed", error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Circle />
      <View style={styles.input}>
        <Text style={styles.heading}>Email Confirmation</Text>
        <CustomTextInput
          placeholder="john.doe@example.com"
          secureTextEntry={false}
          inputMode="email"
          value={email}
          onChangeText={updateEmail}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <CustomGradientButton text="Confirm" isLoading={isLoading} />
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
  input: {
    marginTop: 250,
  },
  heading: {
    marginBottom: 25,
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

export default EmailConfirmation;
