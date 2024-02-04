import { Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import {heightConstant, radiusConstant, widthConstant} from "../customs/CustomResponsiveScreen";

type CustomTextProps = {
  text: string;
  isItalic: boolean;
};

const CustomText = ({ text, isItalic }: CustomTextProps) => {
  return (
    <MaskedView
      style={{ flexDirection: "row" }}
      maskElement={
        <Text
          style={[
            styles.forgotPasswordButton,
            isItalic ? { fontStyle: "italic" } : { fontStyle: "normal" },
          ]}>
          {text}
        </Text>
      }>
      <LinearGradient
        colors={["#B80DCA", "#4035CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text
          style={[
            styles.forgotPasswordButton,
            { opacity: 0 },
            isItalic ? { fontStyle: "italic" } : { fontStyle: "normal" },
          ]}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  forgotPasswordButton: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20*radiusConstant,
    fontWeight: "600",
  },
});

export default CustomText;
