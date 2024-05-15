import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
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
import QrCodeModal from "../../ui/qrCodeModal";
import colors from "../../ui/colors";
import supabase from "../../lib/supabase";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [numberOfFreeRights, setNumberOfFreeRights] = useState<number[]>([]);
  const username = useUserStore((state) => state.user.username);
  const userID = useUserStore((state) => state.user.id);
  const brandId = useBrandStore((state) => state.brand.id);
  const branchId = useBrandBranchStore((state) => state.brandBranch.id);
  const contractAddress = useBrandStore((state) => state.brand.contractAddress);
  const nftSrc = useBrandStore((state) => state.brand.nftSrc);
  const freeRightImageUrl = useBrandStore(state => state.brand.freeRightImageUrl)

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const address = useAddress();
  const { contract: usedNFTContract } = useContract(contractAddress);
  const {
    data: nftData,

    error,
  } = useOwnedNFTs(usedNFTContract, address);

  const renderImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("user_orders")
      .select("user_total_free_rights")
      .eq("user_id", userID)
      .eq("brand_id", brandId);
    if (data) {
      setNumberOfFreeRights(new Array(data[0].user_total_free_rights).fill(0));
    } else {
      console.log("error", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    renderImages();
  }, []);

  useEffect(() => {
    console.log("userID", userID);
    console.log("brandID", brandId)
    const numberOfFreeRights = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_orders",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          setNumberOfFreeRights(
            new Array(payload.new.user_total_free_rights).fill(0)
          );
        }
      )
      .subscribe();
    if (qrCodeModalVisible) setQrCodeModalVisible(false);
    return () => {
      console.log("numberOfFreeRights", numberOfFreeRights);
      supabase.removeChannel(numberOfFreeRights);
    };
  }, [numberOfFreeRights]);

  // Touchable opacity compunun yüksekliği NFT' den büyük. Şu anda bi sıkıntı yok ama sonrasında yüksekliği her nft içn ayarlayalım
  // Tmm knk olr
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
          {!isLoading ?
            (selectedTab === "Waiting" &&
              (numberOfFreeRights.length > 0 ? (
                <FlatList
                  data={numberOfFreeRights}
                  extraData={numberOfFreeRights}
                  scrollEnabled={false}
                  ListEmptyComponent={() => <ActivityIndicator color={colors.purple} size={"large"} />}
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
              ))) : (
              <ActivityIndicator color={colors.purple} size={"large"} />
            )}
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
                            uri: nftSrc?.replace(
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
          value={JSON.stringify({ forNFT: true, userID, brandBranchID: branchId })}
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
