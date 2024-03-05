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
import colors from "../../ui/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const username = useUserStore((state) => state.user.username);
  const userID = useUserStore((state) => state.user.id);
  const contractAddress = useAdminStore((state) => state.admin.contractAddress);
  const NFTSrc = useAdminStore((state) => state.admin.NFTSrc);
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

  // NFT renderlama kısmında doğru bir logic lazım. kullanıcının sahip olduğu bütün NFT'leri renderlayamayız mesela Waiting kısmında.
  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView ekleyelim */}
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
              renderItem={() => (
                <TouchableOpacity onPress={() => setQrCodeModalVisible(true)}>
                  <Image
                    source={{
                      uri: NFTSrc.replace("ipfs://", "https://ipfs.io/ipfs/"),
                    }}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.metadata.id}
              numColumns={2}
            />
          ) : (
            <Text style={styles.infoText}>
              Şu anda indirim/ücretsiz hakkınız bulunmamaktadır.
            </Text>
          ))}
        {selectedTab === "Your Collection" &&
          (nftData && nftData?.length > 0 ? (
            <FlatList
              data={nftData}
              renderItem={() => (
                <Image
                  source={{
                    uri: NFTSrc.replace("ipfs://", "https://ipfs.io/ipfs/"),
                  }}
                  style={styles.icon}
                  resizeMode="contain"
                />
              )}
              keyExtractor={(item) => item.metadata.id}
              numColumns={2}
            />
          ) : (
            <Text style={styles.infoText}>
              Herhangi bir NFT' ye sahip değilsiniz.
            </Text>
          ))}
      </View>
      <QrCodeModal
        isVisible={qrCodeModalVisible}
        value={JSON.stringify({ userId: userID, forNFT: true })}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    paddingTop: 70 * heightConstant,
  },
  header: {
    fontFamily: "Arial",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    color: colors.white,
    marginBottom: 60 * heightConstant,
    marginLeft: 30 * widthConstant,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
  },
  iconContainer: {
    alignItems: "center",
  },
  infoText: {
    fontSize: 24 * radiusConstant,
    color: colors.white,
    marginTop: 60 * heightConstant,
  },
  icon: {
    width: 375 * widthConstant,
    height: 375 * heightConstant,
    aspectRatio: 1,
  },
  selectedTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFFFFF",
  },
});
