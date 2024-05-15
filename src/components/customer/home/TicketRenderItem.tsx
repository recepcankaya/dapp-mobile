import { ImageBackground, StyleSheet, View } from "react-native";
import colors from "../../../ui/colors";
import { heightConstant, widthConstant } from "../../../ui/responsiveScreen";

type TicketRenderItemProps = {
  index: number;
  totalUserOrders: number;
};

export default function TicketRenderItem({
  index,
  totalUserOrders,
}: TicketRenderItemProps) {
  if (index < totalUserOrders) return (
    <ImageBackground source={{ uri: "https://ipfs.io/ipfs/Qmea5bapN7ktQxRqJy1QxCfbXvKJppa7wnPENGFjDVkKHz" }} style={styles.circle} resizeMode="contain" imageStyle={{ borderRadius: 40 }}>

    </ImageBackground>
  )
  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: colors.coffee
        },
      ]}
    />

  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.coffee,
    height: 60 * heightConstant,
    width: 60 * widthConstant,
    borderRadius: 40,
    margin: 3,
  },
});
