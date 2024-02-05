import { StyleSheet, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type CustomTextInputProps = {
  secureTextEntry: boolean;
  placeholder: string;
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  inputMode:
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
};

const CustomTextInput = ({
  secureTextEntry,
  placeholder,
  value,
  onChangeText,
  inputMode,
}: CustomTextInputProps) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={["#B80DCA", "#4035CB"]}
      style={styles.linearGradient}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            value ? { fontStyle: "normal" } : { fontStyle: "italic" },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#0C0C0C"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          inputMode={inputMode}
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
    backgroundColor: "#D9D9D9",
    paddingLeft: 10,
  },
  input: {
    width: 302,
    height: 60,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 18,
  },
});

export default CustomTextInput;
