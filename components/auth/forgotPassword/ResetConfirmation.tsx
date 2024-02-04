/**
 * Represents the Code/Token Confirmation component.
 * This component checks the code sent to the user's email address.
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
import {heightConstant, radiusConstant, widthConstant} from "../../customs/CustomResponsiveScreen";

const { width, height } = Dimensions.get("window");

const ResetConfirmation = () => {
  const { passwordToken, setPasswordToken } = useContext(PasswordTokenContext);
  const [code, setCode] = useState("");
  const { isLoading, setLoading } = useLoading();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSubmit = () => {
    setLoading(true);
    //if statement for check code and passwordToken are equal
    if (passwordToken === code) {
      navigation.navigate("Reset Password");
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
          { width: 650.637*widthConstant, height: 739.49*heightConstant, borderRadius: 739.49*radiusConstant },
        ]}
      />
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
    borderWidth: 5*radiusConstant,
    borderColor: "#B80DCA",
    backgroundColor: "solid",
    position: "absolute",
    top: -545*heightConstant,
    alignSelf: "center",
  },
  input: {
    marginTop: 250*heightConstant,
  },
  heading: {
    marginBottom: 25*heightConstant,
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 30*radiusConstant,
    fontStyle: "italic",
    fontWeight: "700",
  },
  buttonContainer: {
    right: -140*widthConstant,  //fixed to right according to screen size
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",

  },
});

export default ResetConfirmation;
