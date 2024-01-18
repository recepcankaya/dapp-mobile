/**
 * Represents the Code/Token Confirmation component.
 * This component checks the code sent to the user's email address.
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

const ResetConfirmation: React.FC = () => {
  const [code, setCode] = useState("");
  const navigation = useNavigation();

  const handleSubmit = () => {
    // navigation.navigate("Reset Confirmation");
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
        <Text style={styles.heading}>Code Confirmation</Text>
        <CustomTextInput
          placeholder=""
          secureTextEntry={false}
          inputMode="numeric"
          value={code}
          onChangeText={setCode}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <Svg width="168" height="157" viewBox="0 0 177 157" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M109.119 6.28364C125.645 9.54071 136.874 23.7587 151.609 32.0213C167.73 41.0608 191.703 40.3053 199.769 57.1128C207.807 73.8619 191.716 92.3733 189.443 110.861C187.111 129.843 196.896 151.2 186.264 166.995C175.554 182.907 154.52 188.842 135.635 190.807C118.409 192.598 103.331 181.459 86.4893 177.372C68.4574 172.996 47.9926 177.249 33.1719 165.941C17.2693 153.808 5.09061 134.639 4.04704 114.473C3.02277 94.6792 18.9714 79.1193 27.7632 61.4214C36.1565 44.526 39.0109 23.3912 54.5136 12.8845C70.0737 2.33886 90.7526 2.66378 109.119 6.28364Z"
              fill="#050505"
              stroke="url(#gradient)"
              strokeWidth="7"
            />
            <Defs>
              <SvgLinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#B80DCA" />
                <Stop offset="100%" stopColor="#4035CB" />
              </SvgLinearGradient>
            </Defs>
          </Svg>
          <MaskedView
            style={styles.buttonText}
            maskElement={
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: "Inter",
                  fontStyle: "italic",
                }}>
                Submit
              </Text>
            }>
            <LinearGradient
              colors={["#B80DCA", "#4035CB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: "Inter",
                  fontStyle: "italic",
                  opacity: 0,
                }}>
                Submit
              </Text>
            </LinearGradient>
          </MaskedView>
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
  buttonText: {
    fontFamily: "Inter",
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: "400",
    right: 30,
    bottom: 40,
    position: "absolute",
    zIndex: 1,
  },
});

export default ResetConfirmation;
