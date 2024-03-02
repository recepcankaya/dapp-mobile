import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import {
    Camera,
    useCameraPermission,
    useCameraDevice,
    PhotoFile,
    useCodeScanner,
} from "react-native-vision-camera";
import { heightConstant, widthConstant } from "../../ui/responsiveScreen";


const AdminCamera = () => {
    const { hasPermission, requestPermission } = useCameraPermission();

    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, []);

    if (!hasPermission) return <ActivityIndicator />;

    const device = useCameraDevice("back");

    if (!device) return <Text style={styles.noCamera}>No Camera</Text>;

    const codeScanner = useCodeScanner({
        codeTypes: ["qr", "ean-13"],
        onCodeScanned: (codes) => {
            console.log("codes", codes[0].value);
        },
    });

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
                codeScanner={codeScanner}
            />
            <TouchableOpacity
                style={styles.takePhotoButton}
            ></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noCamera: {
        position: "absolute",
        alignSelf: "center",
        textAlign: "center",
        bottom: 300,
    },
    camera: {
        ...StyleSheet.absoluteFillObject,
    },
    takePhotoButton: {
        position: "absolute",
        bottom: 100 * heightConstant,
        alignSelf: "center",
        width: 75 * widthConstant,
        height: 75 * widthConstant,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 50,
        borderWidth: 5,
        borderColor: "#fff",
    },
});

export default AdminCamera;