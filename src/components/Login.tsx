import { View, StyleSheet, StatusBar } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddress, ConnectEmbed } from "@thirdweb-dev/react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.form}>
        <ConnectEmbed
          modalTitle="Sign In"
          modalTitleIconUrl=""
          container={{ paddingVertical: "lg", borderRadius: "lg" }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
  },
  form: {
    width: "80%",
    alignSelf: "center",
  },
});

export default Login;
