import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface CustomTextProps {
  style: any;
  children: React.ReactNode;
}

const CustomText = (props: CustomTextProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "custom-font": require("../assets/fonts/ZenDots-Regular.ttf"),
      });

      setFontLoaded(true);
    }

    loadFont();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text style={{ ...props.style, fontFamily: "custom-font" }}>
      {props.children}
    </Text>
  );
};

const LoginPage = () => {
  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const imageHeight = height - statusBarHeight;

  const [animation, setAnimation] = useState(new Animated.Value(0));

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(circleAnimationRight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(circleAnimationLeft, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textAnimation, {
        toValue: 4,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        navigation.navigate("Register");
      }, 3000);
    });
  };

  const circleAnimationRight = new Animated.Value(1);
  const circleAnimationLeft = new Animated.Value(0);

  const circleOpacityRight = circleAnimationRight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const circleOpacityLeft = circleAnimationLeft.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rectangleColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#7A0099", "#00168C"],
  });

  const rectangleBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#6A0084", "#080060"],
  });

  const textAnimation = new Animated.Value(0);
  const textPosition = textAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 26],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#9600BC", "#000936"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={styles.gradient}
        locations={[0.1885, 1.2]}>
        <ImageBackground
          source={require("../assets/Checks.png")}
          style={[
            styles.background,
            { height: imageHeight, marginTop: statusBarHeight },
          ]}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              source={require("../assets/LadderLogo.png")}
              style={{
                position: "absolute",
                top: 130,
                width: 197,
                height: 197,
              }}
            />
            <TouchableOpacity onPress={handlePress}>
              <Animated.View
                style={{ marginTop: 240 + 197, position: "relative" }}>
                <Animated.View
                  style={{
                    position: "absolute",
                    opacity: circleOpacityRight,
                    left: 247,
                    top: (76 - 33 * 2) / 2,
                    width: 33 * 2,
                    height: 33 * 2,
                    borderRadius: 33,
                    backgroundColor: "#58006e",
                    zIndex: 1,
                  }}
                />
                <Animated.View
                  style={{
                    position: "absolute",
                    opacity: circleOpacityLeft,
                    left: 6,
                    top: (76 - 33 * 2) / 2,
                    width: 33 * 2,
                    height: 33 * 2,
                    borderRadius: 33,
                    backgroundColor: "#080060",
                    zIndex: 1,
                  }}
                />
                <Animated.View
                  style={{
                    width: 317 + 4,
                    height: 72 + 4,
                    borderRadius: 42,
                    backgroundColor: "black",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Animated.View
                    style={{
                      width: 317,
                      height: 72,
                      borderRadius: 40,
                      backgroundColor: rectangleColor,
                      borderWidth: 2,
                      borderColor: rectangleBorderColor,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 15,
                    }}>
                    <Animated.View
                      style={{
                        position: "absolute",
                        transform: [{ translateX: textPosition }],
                      }}>
                      <CustomText
                        style={{
                          color: "#FFF",
                          fontFamily: "Zen Dots",
                          fontSize: 24,
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: 24,
                        }}>
                        Connect Wallet
                      </CustomText>
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default LoginPage;
