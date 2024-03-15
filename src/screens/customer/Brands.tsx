import { useEffect } from "react";
import { StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import useAdminStore, { Admin } from "../../store/adminStore";
import { widthConstant } from "../../ui/responsiveScreen";
import colors from "../..//ui/colors";
import { secretSupabase } from "../../lib/supabase";

const Brands = () => {
  const admins = useAdminStore((state) => state.admins);
  const updateAdmin = useAdminStore((state) => state.updateAdmin);
  const updateAdmins = useAdminStore((state) => state.updateAdmins);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAdmins = async () => {
    try {
      // @todo - auth yapmak için users ile adminsi bağlayalım
      const { data, error } = await secretSupabase
        .from("admins")
        .select(
          "id, brand_name, brand_logo_ipfs_url, number_for_reward, nft_src, contract_address, not_used_nft_src, not_used_contract_address"
        );
      if (error) {
        console.log(error);
      } else {
        const admins: Admin[] = data.map((item) => ({
          id: item.id,
          brandName: item.brand_name,
          brandLogo: item.brand_logo_ipfs_url,
          numberForReward: item.number_for_reward,
          NFTSrc: item.nft_src,
          contractAddress: item.contract_address,
          notUsedNFTSrc: item.not_used_nft_src,
          notUsedContractAddress: item.not_used_contract_address,
        }));
        updateAdmins(admins);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);

  const selectBrand = (item: Admin) => {
    updateAdmin(item);
    navigation.navigate("TabNavigator");
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={admins}
        extraData={admins}
        renderItem={({ item }: { item: Admin }) => (
          <TouchableOpacity
            style={styles.brand}
            onPress={() => selectBrand(item)}>
            <Image
              source={{
                uri: item.brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/"),
              }}
              style={styles.brandImage}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(index) => index.toString()}
        numColumns={2}
      />
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
  brand: {
    width: 130 * widthConstant,
    height: 130 * widthConstant,
    alignItems: "center",
    justifyContent: "center",
    margin: 30 * widthConstant,
  },
  brandImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: colors.pink,
    aspectRatio: 1,
  },
});

export default Brands;
