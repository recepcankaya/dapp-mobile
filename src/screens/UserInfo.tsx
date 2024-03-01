import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "../lib/supabase";
import { useAddress } from "@thirdweb-dev/react-native";

const UserInfo = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const walletAddr = useAddress();

  const submitForm = async () => {
    console.log("walletAddr: ", walletAddr);
    const { data, error } = await supabase
      .from("users")
      .update({ name, surname })
      .eq("walletAddr", walletAddr);
    if (error) {
      console.error("Error inserting data: ", error);
    } else {
      console.log("Data inserted successfully: ", data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>Adınız:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>Soyadınız:</Text>
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
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
