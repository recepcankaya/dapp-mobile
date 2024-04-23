import { FlatList, ImageBackground, StyleSheet, View } from "react-native";

import TicketRenderItem from "./TicketRenderItem";

import useAdminStore from "../../../store/adminStore";
import colors from "../../../ui/colors";
import Text from "../../../ui/customText";
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
                data={ticketCircles}
                extraData={ticketCircles}
                renderItem={({ item, index }) => (
                    <TicketRenderItem index={index} userOrderNumber={userOrderNumber} />
                )}
                numColumns={4}
                columnWrapperStyle={{ justifyContent: "space-between", height: 95 * heightConstant, alignItems: 'center' }}
                contentContainerStyle={styles.circles}
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
        justifyContent: 'center'
    },
});
