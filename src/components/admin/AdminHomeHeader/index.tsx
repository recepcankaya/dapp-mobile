import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import colors from "../../../ui/colors";
import { responsiveFontSize } from "../../../ui/responsiveFontSize";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Brand } from "../../../types/dbTables.types";
const { width } = Dimensions.get("window");

type HomeHeaderProps = {
  brandName: Brand["brandName"];
  brandLogo: Brand["brandLogoIpfsUrl"];
};

const AdminHomeHeader = ({ brandName, brandLogo }: HomeHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const statusBarHeight = useSafeAreaInsets().top;
  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <View style={styles.main}>
        <View style={styles.titleContainer}>
          <Icon name="package" style={styles.icon} size={25} />
          <Text style={styles.title}>{brandName}</Text>
        </View>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            style={styles.qrCodeContainer}
            onPress={() => navigation.navigate("Admin Camera")}>
            <Text style={styles.qrCodeText}>Qr Kodu Okut</Text>
          </TouchableOpacity>
          <Image
            source={{
              uri: brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/"),
            }}
            style={styles.logo}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    padding: 5,
    borderBottomWidth: 1,
    backgroundColor: colors.yellow,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: responsiveFontSize(20),
  },
  icon: {},
  qrCodeContainer: {
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  qrCodeText: {
    color: colors.white,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
  },
});

export default AdminHomeHeader;
