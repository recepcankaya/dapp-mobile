import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import {
  useOwnedNFTs,
  useAddress,
  useContract,
} from "@thirdweb-dev/react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  heightConstant,
  radiusConstant,
  widthConstant,
} from "../../ui/responsiveScreen";
import useUserStore from "../../store/userStore";
import useAdminStore from "../../store/adminStore";
import QrCodeModal from "../../ui/qrCodeModal";
import colors from "../../ui/colors";
import supabase from "../../lib/supabase";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [numberOfFreeRights, setNumberOfFreeRights] = useState<number[]>([]);
  const username = useUserStore((state) => state.user.username);
  const userID = useUserStore((state) => state.user.id);
  const adminId = useAdminStore((state) => state.admin.id);
  const contractAddress = useAdminStore((state) => state.admin.contractAddress);
  const NFTSrc = useAdminStore((state) => state.admin.NFTSrc);

  const freeRightImageUrl = useAdminStore((state) => state.admin.freeRightImageUrl);
  const address = useAddress();
  const { contract: usedNFTContract } = useContract(contractAddress);
  const {
    data: nftData,
    isLoading,
    error,
  } = useOwnedNFTs(usedNFTContract, address);

  const renderImages = async () => {
    const { data, error } = await supabase
      .from("user_missions")
      .select("number_of_free_rights")
      .eq("user_id", userID)
      .eq("admin_id", adminId);
    if (data) {
      setNumberOfFreeRights(new Array(data[0].number_of_free_rights).fill(0));
    } else {
      console.log("error", error);
    }
  };

  useEffect(() => {
    renderImages();
  }, []);

  useEffect(() => {
    const numberOfFreeRights = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_missions",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          setNumberOfFreeRights(
            new Array(payload.new.number_of_free_rights).fill(0)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(numberOfFreeRights);
    };
  }, [numberOfFreeRights]);

  // Touchable opacity compunun yüksekliği NFT' den büyük. Şu anda bi sıkıntı yok ama sonrasında yüksekliği her nft içn ayarlayalım
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>{username}</Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setSelectedTab("Waiting")}>
            <Text
              style={[
                styles.waitingTabText,
                selectedTab === "Waiting" && styles.selectedTab,
              ]}>
              Bekleyenler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("Your Collection")}>
            <Text
              style={[
                styles.collectionTabText,
                selectedTab === "Your Collection" && styles.selectedTab,
              ]}>
              Koleksiyonunuz
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          {selectedTab === "Waiting" &&
            (numberOfFreeRights.length > 0 ? (
              <FlatList
                data={numberOfFreeRights}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View>
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => setQrCodeModalVisible(true)}>
                      <Image
                        source={{
                          uri: freeRightImageUrl.replace(
                            "ipfs://",
                            "https://ipfs.io/ipfs/"
                          ),
                        }}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
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
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View>
                    {Array.from({ length: Number(item.quantityOwned) }).map(
                      (_, i) => (
                        <Image
                          key={i}
                          source={{
                            uri: NFTSrc.replace(
                              "ipfs://",
                              "https://ipfs.io/ipfs/"
                            ),
                          }}
                          style={styles.icon}
                          resizeMode="contain"
                        />
                      )
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.metadata.id + item.quantityOwned}
                numColumns={1}
              />
            ) : (
              <Text style={styles.infoText}>
                Herhangi bir Koleksiyon parçasına sahip değilsiniz.
              </Text>
            ))}
        </View>
        <QrCodeModal
          isVisible={qrCodeModalVisible}
          value={JSON.stringify({ userID, forNFT: true, address })}
          onClose={() => setQrCodeModalVisible(false)}
        />
      </ScrollView>
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
    fontSize: 22 * radiusConstant,
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
