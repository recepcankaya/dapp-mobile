import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import colors from "../../ui/colors";
import supabase from "../../lib/supabase";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const submitForm = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error);
      return;
    }
    setEmail("");
    setPassword("");
    navigation.navigate("Admin Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.header}>Giriş Yap</Text>
          <View style={styles.inputContainer}>
            <TextInput
              inputMode="email"
              placeholder="Mailiniz"
              style={styles.input}
              placeholderTextColor="#000"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Şifreniz"
              secureTextEntry={true}
              style={styles.input}
              placeholderTextColor="#000"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
        <Pressable style={styles.button} onPress={submitForm}>
          <Text style={styles.header}>Giriş Yap</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    height: "50%",
    borderColor: "#C8AFD6",
    borderWidth: 2,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    height: "60%",
    width: "80%",
    justifyContent: "space-between",
  },
  header: {
    color: colors.white,
    fontSize: 24,
  },
  inputContainer: {
    gap: 40,
  },
  input: {
    backgroundColor: "#C8AFD6",
    width: "100%",
    height: 50,
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 18,
  },
  button: {
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
export default AdminLogin;
