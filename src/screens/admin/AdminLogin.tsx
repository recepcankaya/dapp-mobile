import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import colors from "../../ui/colors";
import supabase from "../../lib/supabase";
import updateAdminId from "../../store/adminId";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAdminId = updateAdminId((state) => state.setAdminId);
  const setAdminEmail = updateAdminId((state) => state.setAdminEmail); // get the setAdminEmail function
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const submitForm = async () => {
    if (!email || !password) {
      Alert.alert("Giriş Hatası", "Mail ve şifre alanları boş bırakılamaz.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data) {
      if (data.user) {
        setAdminId(data.user.id);
        setAdminEmail(email);
        // Check if it's the first login
        if (data.user.last_sign_in_at === null) {
          navigation.navigate("Admin New Password");
        }
        else {
          setEmail("");
          setPassword("");
          navigation.navigate("Admin Home");
        }
      }
    }
    if (error) {
      console.error(error);
      return;
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
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
        <TouchableOpacity style={styles.continueButton} onPress={submitForm}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
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
    height: 600,
    alignItems: "stretch",
    justifyContent: "center",
  },
  header: {
    color: colors.white,
    fontSize: 24,
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    gap: 40,
    marginBottom: 100,
  },
  input: {
    backgroundColor: colors.pink,
    width: "100%",
    height: 60,
    borderRadius: 20,
    paddingLeft: 20,
    fontSize: 18,
  },
  continueButton: {
    borderWidth: 2,
    borderColor: colors.pink,
    width: "80%",
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 24,
    color: colors.white,
  },
});
export default AdminLogin;
