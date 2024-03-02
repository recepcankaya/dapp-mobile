import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../ui/colors";

const AdminHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Admin Home</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    fontSize: 24,
    color: colors.white,
  },
});

export default AdminHome;
