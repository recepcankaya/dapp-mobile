import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  heightConstant,
  radiusConstant,
  widthConstant,
} from "../../ui/responsiveScreen";
import useUserStore from "../../store/userStore";
import {
  useOwnedNFTs,
  useAddress,
  useContract,
  useNFT,
} from "@thirdweb-dev/react-native";
import useAdminForAdminStore from "../../store/adminStoreForAdmin";
import useAdminStore from "../../store/adminStore";
import QrCodeModal from "../../ui/qrCodeModal";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const username = useUserStore((state) => state.user.username);
  const contractAddress = useAdminStore((state) => state.admin.contractAddress);
  const address = useAddress();
  const { contract } = useContract(contractAddress);
  const {
    data: nftData,
    isLoading,
    error,
  } = useOwnedNFTs(
    contract,
    "0x58bc2ade1d6341d363da428f735d0d6def5eb661"
    // address
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{username}</Text>
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setSelectedTab("Waiting")}>
          <Text
            style={[
              styles.waitingTabText,
              selectedTab === "Waiting" && styles.selectedTab,
            ]}>
            Waiting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Your Collection")}>
          <Text
            style={[
              styles.collectionTabText,
              selectedTab === "Your Collection" && styles.selectedTab,
            ]}>
            Your Collection
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        {selectedTab === "Waiting" &&
          (nftData && nftData?.length > 0 ? (
            <FlatList
              data={nftData}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setQrCodeModalVisible(true)}>
                  <Image
                    source={{ uri: nftData[0].metadata.image ?? undefined }}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.metadata.id}
              numColumns={2}
            />
          ) : (
            <Text style={{ color: "#fff" }}>
              Şu anda indirim/ücretsiz hakkınız bulunmamaktadır.
            </Text>
          ))}
        {selectedTab === "Your Collection" &&
          (nftData && nftData?.length > 0 ? (
            <FlatList
              data={nftData}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: nftData[0].metadata.image ?? undefined }}
                  style={styles.icon}
                  resizeMode="contain"
                />
              )}
              keyExtractor={(item) => item.metadata.id}
              numColumns={2}
            />
          ) : (
            <Text style={{ color: "#fff" }}>
              Herhangi bir NFT' ye sahip değilsiniz
            </Text>
          ))}
      </View>
      <QrCodeModal
        isVisible={qrCodeModalVisible}
        value={"atakan"}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  header: {
    fontFamily: "Arial",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    lineHeight: 35 * heightConstant,
    letterSpacing: 0.05,
    textAlign: "left",
    width: 159 * widthConstant,
    height: 53 * heightConstant,
    top: 100 * heightConstant,
    left: 28 * widthConstant,
    color: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: 200 * heightConstant,
    left: 35 * widthConstant,
  },
  waitingTabText: {
    fontFamily: "Rosarivo",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    lineHeight: 30 * heightConstant,
    letterSpacing: 0.15,
    textAlign: "left",
    width: 101 * widthConstant,
    height: 35 * heightConstant,
    color: "#FFFFFF",
  },
  collectionTabText: {
    fontFamily: "Rosarivo",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    lineHeight: 30 * heightConstant,
    letterSpacing: 0.15,
    textAlign: "left",
    width: 203 * widthConstant,
    height: 35 * heightConstant,
    color: "#FFFFFF",
    right: 28 * widthConstant,
  },
  iconContainer: {
    marginTop: 250 * heightConstant,
    marginLeft: -45 * widthConstant,
  },
  icon: {
    width: 125 * widthConstant,
    height: 125 * heightConstant,
    marginLeft: 90 * widthConstant,
    marginTop: 40 * heightConstant,
    aspectRatio: 1,
  },
  selectedTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFFFFF",
  },
});
