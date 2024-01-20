import { StyleSheet, Text, TextInput, View } from "react-native";
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
      style={{
        marginBottom: 30,
        height: 63,
        borderRadius: 10,
        padding: 3,
      }}>
      <View
        style={{
          flex: 1,
          borderRadius: 10,
          backgroundColor: "#D9D9D9",
          justifyContent: "center",
          paddingLeft: 10,
        }}>
        <Text
          style={{
            color: "#D9D9D9",
            fontFamily: "Inter",
            fontSize: 20,
            fontStyle: "italic",
            fontWeight: "600",
          }}></Text>
        <TextInput
          style={styles.input}
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
  input: {
    width: 302,
    height: 40,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 25,
  },
});

export default CustomTextInput;
