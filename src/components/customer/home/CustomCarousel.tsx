import * as React from "react";
import { Dimensions, View, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");
const PAGE_WIDTH = window.width;

type CustomCarouselProps = {
    data: { image: string }[]
};

function Index({ data }: CustomCarouselProps) {
    const baseOptions = {
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH * 0.6,
    } as const;

    return (
        <View
            style={{
                alignItems: "center",
            }}
        >
            <Carousel
                {...baseOptions}
                style={{
                    width: PAGE_WIDTH,
                }}
                loop
                pagingEnabled={true}
                snapEnabled={true}
                autoPlay={false}
                autoPlayInterval={1500}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                data={data}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image source={{ uri: item.image }} style={{ width: '100%', height: 200, alignSelf: 'center' }} resizeMode="contain" />
                    </View>
                )}
            />
        </View>
    );
}


export default Index;