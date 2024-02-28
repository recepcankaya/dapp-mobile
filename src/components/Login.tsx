import { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddress, ConnectEmbed } from "@thirdweb-dev/react-native";

const Login = () => {
  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <ConnectEmbed />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#050505",
    justifyContent: "space-between",
  },
});

export default Login;
