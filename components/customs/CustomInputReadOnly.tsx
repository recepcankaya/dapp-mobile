import { StyleSheet, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {heightConstant, radiusConstant, widthConstant} from "../customs/CustomResponsiveScreen";

type CustomTextInputProps = {
  placeholder: string;
};

const CustomInputReadOnly = ({ placeholder }: CustomTextInputProps) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={["#B80DCA", "#4035CB"]}
      style={styles.linearGradient}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
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
    height: 60 * heightConstant,
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
    width: 302 * widthConstant,
    height: 55 * heightConstant,
    borderColor: "transparent",
    borderWidth: 1 * radiusConstant,
    borderRadius: 10 * radiusConstant,
    paddingLeft: 10 * widthConstant,
    fontSize: 22 * radiusConstant,
  },
});

export default CustomInputReadOnly;
