import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, Dimensions, Modal, StyleSheet, FlatList } from 'react-native';

import colors from '../../../ui/colors';

type CustomCarouselProps = {
    data: { image: string }[]
}

const CustomCarousel = ({ data }: CustomCarouselProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [carouselItems, setCarouselItems] = useState(data);
    const { width, height } = Dimensions.get('window');
    const CARD_WIDTH = width;

    const openImage = (imageUri: string) => {
        setSelectedImage(imageUri);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
            <FlatList
                data={carouselItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                snapToAlignment="center"
                scrollEventThrottle={16}
                decelerationRate={0}
                contentContainerStyle={{ backgroundColor: colors.black, marginTop: 10 }}
                style={{ backgroundColor: colors.black }}
                pagingEnabled
                onEndReachedThreshold={0.5}
                onEndReached={() => setCarouselItems([...carouselItems, ...data])}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable
                            key={index}
                            style={{ width: CARD_WIDTH, alignSelf: 'center', alignItems: 'center' }}
                            onPress={() => openImage(item.image)}
                        >
                            <Image source={{ uri: item.image }} style={{ height: 200, width: CARD_WIDTH }} resizeMode='contain' />
                        </Pressable>
                    )
                }}
            />
            <Modal visible={!!selectedImage} transparent={true} onRequestClose={closeImage}>
                <View style={styles.modalBackground}>
                    <Pressable style={styles.modalContent} onPress={closeImage}>
                        <Image source={{ uri: selectedImage ? selectedImage : '' }} style={{ flex: 1 }} resizeMode='contain' />
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default CustomCarousel;
