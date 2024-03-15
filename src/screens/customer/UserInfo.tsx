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
import { useAddress } from "@thirdweb-dev/react-native";

import supabase from "../../lib/supabase";
import colors from "../../ui/colors";
import useUserStore from "../../store/userStore";

const UserInfo = () => {
  const [username, setUsername] = useState("");
  const updateUser = useUserStore((state) => state.setUser);
  const walletAddr = useAddress();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const submitForm = async () => {
    try {
      if (username.length < 3) {
        Alert.alert(
          "Kullanıcı Adı Hatası",
          "Kullanıcı adınız en az 3 karakter olmalıdır."
        );
        return;
      }
      const { data: user, error } = await supabase
        .from("users")
        .update({ username, last_login: new Date() })
        .eq("walletAddr", walletAddr)
        .select("id, username");
      if (error) {
        Alert.alert(
          "Bunu biz de beklemiyorduk 🤔",
          "Lütfen tekrar dener misiniz 👉👈"
        );
      } else {
        updateUser({
          id: user[0].id,
          username: user[0].username,
          numberOfNFTs: 0,
          orderNumber: 0,
        });
        navigation.navigate("Brands");
        Alert.alert("Uygulamamıza hoşgeldin 🤗🥳", "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>Kullanıcı adınız:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={submitForm}>
          <Text style={styles.buttonText}>Kaydet</Text>
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
  form: {
    height: 600,
    width: "80%",
    borderRadius: 10,
    justifyContent: "space-evenly",
    alignItems: "stretch",
  },
  inputContainer: {
    width: "100%",
    alignSelf: "center",
  },
  labels: {
    color: colors.white,
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    borderColor: colors.pink,
    borderStyle: "solid",
    borderWidth: 2,
    width: "100%",
    height: 60,
    borderRadius: 30,
    paddingLeft: 20,
    color: colors.white,
    fontSize: 18,
  },
  button: {
    backgroundColor: colors.pink,
    width: "100%",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.black,
    fontSize: 20,
  },
});

export default UserInfo;
