import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../ui/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import supabase from "../../lib/supabase";
import updateAdminId from "../../store/adminId";
import { useEffect, useState } from "react";

const AdminHome = () => {
  const [adminDashbordInfo, setAdminDashboardInfo] = useState({
    brand_name: "",
    brand_branch: "",
    number_of_orders: 0,
    used_nfts: 0,
    not_used_nfts: 0,
    number_for_reward: 0,
    last_qr_scan_time: "",
  });
  const adminId = updateAdminId((state) => state.adminId);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAdminDashboard = async () => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select(
          "brand_name, brand_branch, used_nfts, not_used_nfts, number_for_reward, number_of_orders, last_qr_scan_time"
        )
        .eq("id", adminId);
      if (adminData) {
        setAdminDashboardInfo({ ...adminData[0] });
      } else {
        console.error(adminError);
      }
    } catch (error) {
      Alert.alert("Bir hata oluştu", "Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <View style={styles.circle}>
            {/* Brand Logo */}
            <Text style={styles.adminData}></Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>{adminDashbordInfo.brand_name}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            {/* Brand Logo */}
            <Text style={styles.adminData}></Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              {adminDashbordInfo.brand_branch}
            </Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>
              {adminDashbordInfo.number_of_orders}
            </Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bugüne Kadar Kaç Ürün Satıldığı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>
              {adminDashbordInfo.not_used_nfts}
            </Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bekleyen Ödüllerin Sayısı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{adminDashbordInfo.used_nfts}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Verilen Ödüllerin Sayısı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>
              {adminDashbordInfo.number_for_reward}
            </Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Kaç Alışverişte Ödül Verileceği</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.qrCode}
        onPress={() => navigation.navigate("Admin Camera")}>
        <Image
          source={require("../../assets/qr-code.png")}
          style={styles.qrCode}
        />
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
    justifyContent: "center",
    alignItems: "center",
  },
  adminData: {
    color: colors.white,
    fontSize: 20,
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
  qrCode: {
    position: "absolute",
    bottom: 10,
    width: 50,
    height: 50,
  },
});

export default AdminHome;
