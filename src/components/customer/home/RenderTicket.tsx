import { FlatList, ImageBackground, StyleSheet } from "react-native";

import TicketRenderItem from "./TicketRenderItem";

import useAdminStore from "../../../store/adminStore";
import { heightConstant } from "../../../ui/responsiveScreen";

type RenderTicketProps = {
    userOrderNumber: number;
    ticketImage: string;
};

export default function RenderTicket({ userOrderNumber, ticketImage }: RenderTicketProps) {
    const admin = useAdminStore((state) => state.admin);
    const ticketCircles = new Array(admin.numberForReward);
    return (
        <ImageBackground source={{
            uri: ticketImage.replace("ipfs://", "https://ipfs.io/ipfs/"),
        }} style={styles.ticket} resizeMode="contain" >
            <FlatList
                key={admin.numberForReward <= 4 ? 2 : (admin.numberForReward === 5 || admin.numberForReward === 6 ? 3 : 4)}
                data={ticketCircles}
                extraData={ticketCircles}
                renderItem={({ item, index }) => (
                    <TicketRenderItem index={index} userOrderNumber={userOrderNumber} />
                )}
                numColumns={admin.numberForReward <= 4 ? 2 : (admin.numberForReward === 5 || admin.numberForReward === 6 ? 3 : 4)}
                columnWrapperStyle={{ justifyContent: "space-between", height: 95 * heightConstant, alignItems: 'center' }}
                contentContainerStyle={[userOrderNumber > 4 && { justifyContent: 'center' }, styles.circles]}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    ticket: {
        width: "100%",
        height: 190 * heightConstant,
        alignSelf: 'center',
    },
    circles: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 10,
    },
});
