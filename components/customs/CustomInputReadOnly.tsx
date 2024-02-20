import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightConstant,
  radiusConstant,
  widthConstant,
} from "../customs/CustomResponsiveScreen";
import { responsiveFontSize } from "./CustomResponsiveText";

type CustomTextInputProps = {
  placeholder: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
};

const CustomInputReadOnly = ({
  placeholder,
  containerStyle,
  style,
}: CustomTextInputProps) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={["#B80DCA", "#4035CB"]}
      style={[styles.linearGradient, containerStyle]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor="#0C0C0C"
          editable={false}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    height: 75 * heightConstant,
    borderRadius: 10 * radiusConstant,
    padding: 3 * radiusConstant,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 10 * radiusConstant,
    backgroundColor: "#8a8a8a",
    paddingLeft: 10 * widthConstant,
  },
  input: {
    width: 330 * widthConstant,
    height: 65 * heightConstant,
    borderColor: "transparent",
    borderWidth: 1 * radiusConstant,
    borderRadius: 10 * radiusConstant,
    paddingLeft: 10 * widthConstant,
    fontSize: responsiveFontSize(23),
  },
});

export default CustomInputReadOnly;
