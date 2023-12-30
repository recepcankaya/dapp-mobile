/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  //async code
  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const tokens = await AsyncStorage.getItem('authTokens');
  //     if (tokens) {
  //       // Parse the stringified tokens back into an object
  //       const parsedTokens = JSON.parse(tokens);
  //       console.log(parsedTokens);
  //       // Validate the tokens if necessary
  //       // Navigate to the main app
  //       navigation.navigate('ProfileTab');
  //     } else {
  //       // Navigate to the login screen
  //       navigation.navigate('Register');
  //     }
  //   };
  
  //   // Add a 5-second delay before checking the auth status
  //   const timeoutId = setTimeout(checkAuthStatus, 5000);
  
  //   // Clear the timeout when the component unmounts
  //   return () => clearTimeout(timeoutId);
  // }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('newLogin');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, [navigation]);

  const [springValue] = useState(new Animated.Value(0));
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const spinAnimation = Animated.sequence([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(spinValue, {
        toValue: 2,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(spinValue, {
        toValue: 3,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(spinValue, {
        toValue: 4,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]);

    const animations = Animated.loop(
      Animated.sequence([
        Animated.timing(springValue, {
          toValue: -120,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(springValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        spinAnimation,
      ]),
    );

    animations.start();

    return () => {
      animations.stop();
    };
  }, [spinValue, springValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg', '0deg'],
  });

  const spring = springValue.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 50],
  });

  return (
    <>
      <StatusBar backgroundColor='transparent' translucent={true} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#9600BC', '#000936']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={styles.background}
          locations={[0.1885, 1.2]}
        />

        <View>
          <Animated.Image
            style={[
              styles.loadingLogo,
              { transform: [{ rotate: spin }, { translateY: spring }] },
            ]}
            source={require('./assets/LadderLogo.png')}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  loadingLogo: {
    width: 237,
    height: 237,
  },
});

export default LoadingScreen;
