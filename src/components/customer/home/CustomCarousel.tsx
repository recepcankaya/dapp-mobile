import React, { useState } from 'react';
import { View, Pressable, Image, Dimensions, Modal, StyleSheet, FlatList } from 'react-native';

import colors from '../../../ui/colors';

type CustomCarouselProps = {
    data: { image: string }[]
}
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width;

const CustomCarousel = ({ data }: CustomCarouselProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [carouselItems, setCarouselItems] = useState(data);

    const openImage = (imageUri: string) => {
        setSelectedImage(imageUri);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    return (
        <View style={styles.container}>
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
                <View style={styles.modalBackground}>
                    <Pressable style={styles.modalContent} onPress={closeImage}>
                        <Image source={{ uri: selectedImage ? selectedImage : '' }} style={styles.modalImage} resizeMode='contain' />
                    </Pressable>
                </View>
            </Modal>
        </View>
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
