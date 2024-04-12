import { StyleSheet, View } from "react-native";
import colors from "../../../ui/colors";
import { heightConstant, widthConstant } from "../../../ui/responsiveScreen";

type TicketRenderItemProps = {
  index: number;
  userOrderNumber: number;
};

export default function TicketRenderItem({
  index,
  userOrderNumber,
}: TicketRenderItemProps) {
  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: index < userOrderNumber ? colors.green : colors.pink,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.pink,
    height: 75 * heightConstant,
    width: 75 * widthConstant,
    borderRadius: 40,
    margin: 3,
  },
});
