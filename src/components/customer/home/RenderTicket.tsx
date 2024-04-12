import { FlatList, StyleSheet, View } from "react-native";

import TicketRenderItem from "./TicketRenderItem";

import useAdminStore from "../../../store/adminStore";
import colors from "../../../ui/colors";
import Text from "../../../ui/customText";
import { heightConstant } from "../../../ui/responsiveScreen";

const POSITIONS = [
  { top: -60, left: -60 },
  { top: -60, right: -60 },
  { bottom: -60, left: -60 },
  { bottom: -60, right: -60 },
];

type RenderTicketProps = {
  userOrderNumber: number;
};

export default function RenderTicket({ userOrderNumber }: RenderTicketProps) {
  const admin = useAdminStore((state) => state.admin);
  const ticketCircles = new Array(admin.numberForReward);

  return (
    <View>
      <View style={styles.ticketText}>
        <Text text="Süreciniz" />
      </View>
      <View style={styles.ticket}>
        {POSITIONS.map((position, index) => (
          <View key={index} style={[styles.blackCircles, position]} />
        ))}
        <FlatList
          data={ticketCircles}
          extraData={ticketCircles}
          renderItem={({ item, index }) => (
            <TicketRenderItem index={index} userOrderNumber={userOrderNumber} />
          )}
          numColumns={4}
          contentContainerStyle={styles.circles}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticketText: {
    padding: 20,
    zIndex: 1,
  },
  ticket: {
    width: "100%",
    minHeight: 200 * heightConstant,
    backgroundColor: colors.white,
    paddingTop: 10 * heightConstant,
  },
  blackCircles: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: colors.black,
  },
  circles: {
    flex: 1,
    alignItems: "center",
    marginTop: 15 * heightConstant,
  },
});
