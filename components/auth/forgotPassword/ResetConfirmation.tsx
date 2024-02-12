/**
 * Represents the Code/Token Confirmation component.
 * This component checks the code sent to the user's email address.
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

import { usePasswordTokenStore } from "../../store/passwordTokenStore";

const ResetConfirmation = () => {
  const [code, setCode] = useState("");
  const passwordToken = usePasswordTokenStore((state) => state.passwordToken);
  const { isLoading, setLoading } = useLoading();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSubmit = () => {
    setLoading(true);
    if (passwordToken === code) {
      navigation.navigate("Reset Password");
    } else {
      Alert.alert("Code Confirmation Failed", "Invalid code");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Circle />
      <View style={styles.input}>
        <Text style={styles.heading}>Code Confirmation</Text>
        <CustomTextInput
          placeholder=""
          secureTextEntry={false}
          inputMode="text"
          value={code}
          onChangeText={setCode}
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

export default ResetConfirmation;
