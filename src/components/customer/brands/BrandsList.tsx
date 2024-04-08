import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

import { Admin } from "../../../store/adminStore";
import { heightConstant, widthConstant } from "../../../ui/responsiveScreen";
import colors from "../../../ui/colors";

type BrandsListProps = {
  item: Admin;
  index: number;
  selectBrand: (item: Admin, index: number) => void;
};

export default function BrandsList({
  item,
  index,
  selectBrand,
}: BrandsListProps) {
  return (
    <TouchableOpacity
      style={styles.brand}
      onPress={() => selectBrand(item, index)}>
      <Image
        source={{
          uri: item.brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/"),
        }}
        style={styles.brandImage}
      />
      <Text style={styles.brandName}>{item.brandName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  brandName: {
    color: colors.white,
    marginTop: 10,
    fontSize: 16 * widthConstant,
  },
});
