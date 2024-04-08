import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Geolocation, {
  GeolocationResponse,
} from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";

import useAdminStore, { Admin } from "../../store/adminStore";
import { secretSupabase } from "../../lib/supabase";
import { haversine } from "../../lib/haversine";
import { heightConstant, widthConstant } from "../../ui/responsiveScreen";
import colors from "../..//ui/colors";

const Brands = () => {
  const [searchedAdmin, setSearchedAdmin] = useState<string>("");
  const [customerLocation, setCustomerLocation] = useState<{
    lat: number;
    long: number;
  }>({ lat: 0, long: 0 });
  const updateAdmins = useAdminStore((state) => state.updateAdmins);
  const updateAdmin = useAdminStore((state) => state.updateAdmin);
  const admins = useAdminStore((state) => state.admins);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAdmins = async () => {
    try {
      // @todo - auth yapmak için users ile adminsi bağlayalım
      const { data, error } = await secretSupabase
        .from("admins")
        .select(
          "id, brand_name, brand_logo_ipfs_url, number_for_reward, nft_src, contract_address, not_used_nft_src, not_used_contract_address, coords"
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
          coords: {
            lat: item.coords.lat,
            long: item.coords.long,
          },
        }));
        if (searchedAdmin.length > 0) {
          const filteredAdmins = admins.filter(searchAdmin);
          updateAdmins(filteredAdmins);
        } else {
          updateAdmins(admins);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchAdmin = (admin: Admin) => {
    return admin.brandName.toLowerCase().includes(searchedAdmin.toLowerCase());
  };

  const selectBrand = async (item: Admin, index: number) => {
    updateAdmin(item);
    navigation.navigate("TabNavigator");
  };

  useEffect(() => {
    // Geolocation.getCurrentPosition((info: GeolocationResponse) =>
    //   setCustomerLocation({
    //     lat: info.coords.latitude,
    //     long: info.coords.longitude,
    //   })
    // );
    fetchAdmins();
  }, [searchedAdmin]);

  // useEffect(() => {
  //   const sortedAdmins: Admin[] = admins.sort((a, b): any => {
  //     const distanceA = haversine(
  //       { lat: customerLocation.lat, lng: customerLocation.long },
  //       { lat: a.coords.lat, lng: a.coords.long }
  //     );
  //     const distanceB = haversine(
  //       { lat: customerLocation.lat, lng: customerLocation.long },
  //       { lat: b.coords.lat, lng: b.coords.long }
  //     );
  //     return distanceA - distanceB;
  //   });
  //   updateAdmins(sortedAdmins);
  // }, [customerLocation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          color="#808080"
          size={20 * heightConstant}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchedAdmin}
          onChangeText={setSearchedAdmin}
          style={styles.searchBar}
        />
      </View>
      <FlatList
        data={admins}
        extraData={admins}
        renderItem={({ item, index }: { item: Admin; index: number }) => (
          <TouchableOpacity
            style={styles.brand}
            onPress={() => selectBrand(item, index)}>
            <Image
              source={{
                uri: item.brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/"),
              }}
              style={styles.brandImage}
            />
            <Text style={{ color: colors.white, marginTop: 10 }}>
              {item.brandName}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
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
    paddingTop: 50 * heightConstant,
  },
  searchContainer: {
    width: 350 * widthConstant,
    height: 50 * heightConstant,
    marginBottom: 50 * heightConstant,
    justifyContent: "center",
  },
  searchBar: {
    width: "100%",
    height: "100%",
    color: colors.white,
    fontSize: 18 * heightConstant,
    borderColor: colors.pink,
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 40 * widthConstant,
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -10 }],
    marginLeft: 10 * widthConstant,
  },
  brand: {
    width: 130 * widthConstant,
    height: 130 * widthConstant,
    alignItems: "center",
    justifyContent: "center",
    margin: 30 * widthConstant,
    marginBottom: 40 * heightConstant,
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
