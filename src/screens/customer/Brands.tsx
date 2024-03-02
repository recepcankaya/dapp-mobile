import React, { useEffect } from "react";
import { StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../ui/colors";
import { widthConstant } from "../../ui/responsiveScreen";
import useBrandStore, { Brand } from "../../store/brandStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const data: Brand[] = [
  {
    id: 0,
    name: "Arabica Coffee",
    image:
      "data:image/png;base64,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",
  },
  {
    id: 1,
    name: "Konte Coffee",
    image:
      "https://instagram.fesb4-2.fna.fbcdn.net/v/t51.2885-19/121252717_351791709395747_2786472391245434503_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fesb4-2.fna.fbcdn.net&_nc_cat=111&_nc_ohc=1JMjhkZklPsAX80wO6a&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfCbFKULmcewV60d_a95pQkm_VeqEGgHTFj3vKlcurYpTA&oe=65E679E1&_nc_sid=8b3546",
  },
  {
    id: 2,
    name: "Starbucks Coffee",
    image:
      "https://instagram.fesb4-2.fna.fbcdn.net/v/t51.2885-19/339544208_1149110315771485_1426826486177750095_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fesb4-2.fna.fbcdn.net&_nc_cat=1&_nc_ohc=Kxh54T-ZI4sAX-OJlo7&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfBiXj54a5Rw91tm2BLSh-WUtgw_up6TPFi438WmdHKY6w&oe=65E63692&_nc_sid=8b3546",
  },
  {
    id: 3,
    name: "Coffee de Madrid",
    image:
      "https://instagram.fesb4-1.fna.fbcdn.net/v/t51.2885-19/419317822_1400078940598356_4240951416041746059_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fesb4-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=9UzT9QTX2GIAX-NfpPN&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfD9_zWBTEisELE-KPFJgZs7vfYOd-wofcx9IoMrty1QMg&oe=65E70808&_nc_sid=8b3546",
  },
  {
    id: 4,
    name: "Cafe Mio",
    image:
      "data:image/png;base64,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",
  },
];

const Brands = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const brands = useBrandStore((state) => state.brands);
  const setBrands = useBrandStore((state) => state.setBrands);
  const setBrand = useBrandStore((state) => state.setBrand);
  useEffect(() => {
    //fetch data from api
    setBrands(data);
  }, []);
  const brandListRenderItem = ({
    item,
    index,
  }: {
    item: Brand;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={styles.brand}
        onPress={() => {
          setBrand(item);
          navigation.navigate("TabNavigator");
        }}>
        <Image source={{ uri: item.image }} style={styles.brandImage} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={brands}
        extraData={brands}
        renderItem={({ item, index }: { item: Brand; index: number }) =>
          brandListRenderItem({ item, index })
        }
        keyExtractor={(item) => item.id.toString()}
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
    borderColor: colors.purple,
  },
});

export default Brands;
