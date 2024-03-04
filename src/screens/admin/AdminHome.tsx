import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../ui/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AdminHome = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <View style={styles.circle}></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Marka Adı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Marka Şubesi</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bugüne Kadar Kaç Ürün Satıldığı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bekleyen Ödüllerin Sayısı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Verilen Ödüllerin Sayısı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Kaç Alışverişte Ödül Verileceği</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Admin Camera")}>
        <Text style={{ color: "#fff" }}>QR Code</Text>
      </TouchableOpacity>
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
  infoContainer: {
    width: "90%",
    height: 650,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.pink,
  },
  infoTextContainer: {
    width: "60%",
    height: 70,
    justifyContent: "center",
    backgroundColor: colors.pink,
    borderRadius: 20,
    paddingLeft: 20,
  },
  infoText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AdminHome;
