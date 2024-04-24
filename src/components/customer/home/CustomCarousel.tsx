import React, { useState } from 'react';
import { Pressable, Image, Dimensions, Modal, StyleSheet, FlatList } from 'react-native';

import colors from '../../../ui/colors';
import { Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

type CustomCarouselProps = {
    data: { image: string }[]
}
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width;

const CustomCarousel = ({ data }: CustomCarouselProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [carouselItems, setCarouselItems] = useState(data);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const openImage = (imageUri: string) => {
        setSelectedImage(imageUri);
    };

    const closeImage = () => {
        setSelectedImage(null);
        scale.value = 1;
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <FlatList
                data={carouselItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                snapToAlignment="center"
                scrollEventThrottle={16}
                decelerationRate={0}
                style={styles.carousel}
                contentContainerStyle={styles.carouselContentContainer}
                pagingEnabled
                onEndReachedThreshold={0.5}
                onEndReached={() => setCarouselItems([...carouselItems, ...data])}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable
                            key={index}
                            style={styles.carouselItem}
                            onPress={() => openImage(item.image)}
                        >
                            <Image source={{ uri: item.image }} style={styles.carouselItemImage} resizeMode='contain' />
                        </Pressable>
                    )
                }}
            />
            <Modal visible={!!selectedImage} transparent={true} onRequestClose={closeImage}>
                <Animated.View style={styles.modalBackground}>
                    <Pressable style={styles.modalContent} onPress={closeImage}>
                        <GestureDetector gesture={pinchGesture}>
                            <Animated.Image source={{ uri: selectedImage ? selectedImage : '' }} style={[styles.modalImage, animatedStyle]} resizeMode='contain' />
                        </GestureDetector>
                    </Pressable>
                </Animated.View>
            </Modal>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white
    },
    carousel: {
        backgroundColor: colors.black
    },
    carouselContentContainer: {
        backgroundColor: colors.black,
        marginTop: 10
    },
    carouselItem: {
        width: CARD_WIDTH,
        alignItems: 'center'
    },
    carouselItemImage: {
        height: 180,
        width: CARD_WIDTH
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
    },
    modalImage: {
        flex: 1
    }
});

export default CustomCarousel;
