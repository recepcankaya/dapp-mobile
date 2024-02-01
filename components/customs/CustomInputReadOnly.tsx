import { StyleSheet, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
    height: 60,
    borderRadius: 10,
    padding: 3,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#8a8a8a",
    paddingLeft: 10,
  },
  input: {
    width: 302,
    height: 60,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 22,
  },
});

export default CustomInputReadOnly;
