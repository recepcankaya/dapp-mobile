/**
 * Represents the Email Confirmation component.
 * This component allows the user to confirm their email address.
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import CustomTextInput from "../../customs/CustomTextInput";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomGradientButton from "../../customs/CustomGradientButton";

const EmailConfirmation: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSubmit = () => {
    navigation.navigate("Reset Confirmation");
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
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <CustomGradientButton text="Confirm" />
        </TouchableOpacity>
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
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default EmailConfirmation;
