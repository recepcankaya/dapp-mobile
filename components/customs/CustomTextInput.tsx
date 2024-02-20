import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightConstant,
  radiusConstant,
  widthConstant,
} from "../customs/CustomResponsiveScreen";
import Eyes from "../SVGComponents/Eyes";
import { responsiveFontSize } from "./CustomResponsiveText";

type CustomTextInputProps = {
  secureTextEntry: boolean;
  placeholder: string;
  value: string;
  onChangeText:
    | React.Dispatch<React.SetStateAction<string>>
    | ((text: string) => void);
  inputMode:
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  eyesVisible?: boolean;
  passwordVisible?: boolean;
  setPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomTextInput = ({
  secureTextEntry,
  placeholder,
  value,
  onChangeText,
  inputMode,
  style,
  containerStyle,
  eyesVisible = false,
  passwordVisible,
  setPasswordVisible,
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
          style={[
            styles.input,
            value ? { fontStyle: "normal" } : { fontStyle: "italic" },
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#0C0C0C"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          inputMode={inputMode}
        />
        {eyesVisible && (
          <Eyes
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    height: 75 * heightConstant,
    borderRadius: 10 * radiusConstant,
    padding: 3 * radiusConstant,
    marginTop: 20 * heightConstant,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 10 * radiusConstant,
    backgroundColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    minWidth: 330 * widthConstant,
    paddingLeft: 10 * radiusConstant,
    paddingRight: 10 * radiusConstant,
  },
  input: {
    width: 290 * widthConstant,
    height: 65 * heightConstant,
    borderColor: "transparent",
    borderWidth: 1 * radiusConstant,
    borderRadius: 10 * radiusConstant,
    fontSize: responsiveFontSize(22),
  },
});

export default CustomTextInput;
