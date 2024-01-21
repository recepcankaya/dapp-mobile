/**
 * Represents the Email Confirmation component.
 * This component allows the user to confirm their email address.
 */

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PasswordTokenContext } from "../../context/PasswordTokenContext";

import CustomGradientButton from "../../customs/CustomGradientButton";
import CustomTextInput from "../../customs/CustomTextInput";
import useLoading from "../../hooks/useLoading";
import axios from 'axios';

const { width, height } = Dimensions.get("window");

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const EmailConfirmation = () => {
  const [email_temp, setEmail_temp] = useState("");
  const { passwordToken, setPasswordToken } = useContext(PasswordTokenContext);
  const { isLoading, setLoading } = useLoading();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await api.post('/user/password_reset/', {
        email: email_temp,
      });

      if (response.status === 200) {
        // Navigate to the "Reset Confirmation" page if the request is successful
        setPasswordToken(response.data.token);

        navigation.navigate("Reset Confirmation");
      } else {
        // Handle error
        console.error('Failed to reset password');
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
      <LinearGradient
        colors={["#B80DCA", "#4035CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.circle,
          { width: 650.637, height: 739.49, borderRadius: 739.49 },
        ]}
      />
      <View style={styles.input}>
        <Text style={styles.heading}>Email Confirmation</Text>
        <CustomTextInput
          placeholder="john.doe@example.com"
          secureTextEntry={false}
          inputMode="email"
          value={email_temp}
          onChangeText={setEmail_temp}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit}>
            <CustomGradientButton text="Confirm" isLoading={isLoading} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    right: -width/3.5,  //fixed to right according to screen size
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",

  },
});

export default EmailConfirmation;
