import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "../../lib/supabase";
import { useAddress } from "@thirdweb-dev/react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const UserInfo = () => {
  const [username, setUsername] = useState("");
  const walletAddr = useAddress();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const submitForm = async () => {
    const { error } = await supabase
      .from("users")
      .update({ username, last_login: new Date() })
      .eq("walletAddr", walletAddr);
    if (error) {
      Alert.alert(
        "Bunu biz de beklemiyorduk 🤔",
        "Lütfen tekrar dener misiniz 👉👈"
      );
    } else {
      navigation.navigate("Brands");
      Alert.alert("Uygulamamıza hoşgeldin 🤗🥳", "");
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

        <Button title="Kaydet" onPress={submitForm} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    height: "40%",
    width: "80%",
    backgroundColor: "#2e2d2d",
    borderRadius: 10,
    justifyContent: "space-evenly",
    alignItems: "stretch",
  },
  inputContainer: {
    width: "80%",
    alignSelf: "center",
  },
  labels: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: "#fff",
    borderStyle: "solid",
    borderWidth: 1,
    width: "100%",
    height: "30%",
    borderRadius: 5,
    paddingLeft: 10,
    color: "#fff",
  },
});

export default UserInfo;
