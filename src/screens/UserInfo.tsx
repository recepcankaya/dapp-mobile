import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UserInfo = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
  },
});

export default UserInfo;
