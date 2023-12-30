
import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  BackHandler,
  Image,
  SafeAreaView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Font from 'expo-font'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserContext, UserProvider } from './context/UserContext';
import { MissionContext, MissionProvider } from './context/MissionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TabParamList = {
  Profile: undefined;
  // Add other screens here...
};

type ProfileScreenRouteProp = RouteProp<TabParamList, 'Profile'>;


type RootStackParamList = {
  Profile: undefined;
  'Tasks List': undefined;
  // Add other routes here
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type CustomTextProps = {
  style?: object,
  children: React.ReactNode
}

const CustomText2 = (props: CustomTextProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'custom-font': require('./assets/fonts/ZenDots-Regular.ttf'),
      });

      setFontLoaded(true);
    }

    loadFont();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text style={{ ...props.style, fontFamily: 'custom-font' }}>
      {props.children}
    </Text>
  );
};

const CustomText = (props: CustomTextProps) => {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'custom-font': require('./assets/fonts/Inter-Regular.ttf')
      })

      setFontLoaded(true)
    }

    loadFont()
  }, [])

  if (!fontLoaded) {
    return <Text>Loading...</Text>
  }

  return (
    <Text style={{ ...props.style, fontFamily: 'Inter' }}>
      {props.children}
    </Text>
  )
}

function Profile({ route }: { route: ProfileScreenRouteProp }) {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  //async code
  // const [username, setUsername] = useState('');

  // const getUsername = async () => {
  //   const storedUsername = await AsyncStorage.getItem('username');
  //   // Set the username state variable
  //   setUsername(storedUsername || '');
  // };

  // // ...

  // useEffect(() => {
  //   // Call getUsername when the component mounts
  //   getUsername();
  // }, []);

  const { username } = useContext(UserContext);

  const [missions_list] = useContext(MissionContext);

  function countCompleted(missions_list: { isCompleted: boolean }[]) {
    return missions_list.filter((mission) => mission.isCompleted).length;
  }



  useEffect(() => {
    const backAction = () => {
      // Do nothing and prevent default back button behavior
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <StatusBar backgroundColor='transparent' translucent={true} />

      <UserProvider>
        <View style={styles.container}>
          <LinearGradient
            colors={['#DC00C6', '#2400B4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.background}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.profileIconContainer}>
                <View style={styles.circle}>
                  <Image source={require('./assets/profile_pic.png')} style={{ width: '100%', height: '100%', borderRadius: 50 }} resizeMode="cover" />
                </View>
                <View style={styles.rectanglesContainer}>
                  <View style={styles.rectangle1}>
                    <CustomText style={styles.text}> {username}</CustomText>
                  </View>
                  <View style={styles.rectangle2}>
                    <CustomText style={styles.text}>   Level 0</CustomText>
                  </View>
                </View>
              </View>
              <View style={styles.newRectanglesContainer}>
                <LinearGradient
                  colors={['#5927B1', '#A300B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.newRectangle}
                >
                  <CustomText style={styles.text}>Follower</CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#5927B1', '#A300B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.newRectangle2}
                >
                  <CustomText style={styles.text}>Following</CustomText>
                </LinearGradient>
              </View>
              <View style={styles.newSmallRectanglesContainer}>
                <LinearGradient
                  colors={['#5927B1', '#A300B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.newRectangle3}
                >
                  <CustomText style={styles.text}> - </CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#5927B1', '#A300B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.newRectangle4}
                >
                  <CustomText style={styles.text}> - </CustomText>
                </LinearGradient>
              </View>
              <View style={styles.tasksInfoContainer}>
                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tasksInfo1}
                >
                  <CustomText style={styles.text}>Finished</CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tasksInfo2}
                >
                  <CustomText style={styles.text}>On-Going</CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tasksInfo3}
                >
                  <CustomText style={styles.text}>Unfinished</CustomText>
                </LinearGradient>
              </View>
              <View style={styles.tasksInfoValuesContainer}>
                <LinearGradient
                  colors={['#4D2EB7', '#FD00CA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tasksInfoValue1}
                >
                  <CustomText style={styles.text}>{countCompleted(missions_list)}</CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#4D2EB7', '#FD00CA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tasksInfoValue2}
                >
                  <CustomText style={styles.text}>{missions_list.length - countCompleted(missions_list)}</CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#4D2EB7', '#FD00CA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tasksInfoValue3}
                >
                  <CustomText style={styles.text}>{missions_list.length}</CustomText>
                </LinearGradient>
              </View>
              <View style={styles.pageNamesContainer}>
                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pageName1}
                >
                  <CustomText style={styles.smallText}>NFT</CustomText>
                </LinearGradient>
                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pageName2}
                >
                  <CustomText style={styles.smallText}>Achievements</CustomText>
                </LinearGradient>
              </View>
              <View style={styles.pagesContainer}>
                <LinearGradient
                  colors={['#E002E0', '#3403DC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.page1}
                >
                  <CustomText2
                    style={
                      {
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'center',
                      }
                    }
                  >Coming Soon</CustomText2>
                </LinearGradient>
                <LinearGradient
                  colors={['#E002E0', '#3403DC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.page2}
                >
                  <CustomText2
                    style={
                      {
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'center',
                      }
                    }
                  >Coming Soon</CustomText2>
                </LinearGradient>
              </View>
              <View style={styles.pageNamesContainer2}>
                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pageName3}
                >
                  <CustomText style={styles.smallText}>Wallet</CustomText>
                </LinearGradient>

                <LinearGradient
                  colors={['#0A33A5', '#B100DD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pageName4}
                >
                  <CustomText style={styles.smallText}>Tasks</CustomText>
                </LinearGradient>

              </View>
              <View style={styles.pagesContainer2}>
                <LinearGradient
                  colors={['#E002E0', '#3403DC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.page3}
                >
                  <CustomText2
                    style={
                      {
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'center',
                      }
                    }
                  >Coming Soon</CustomText2>
                </LinearGradient>
                <TouchableOpacity onPress={() => navigation.navigate('Tasks List')}>
                  <LinearGradient
                    colors={['#E002E0', '#3403DC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.page4}
                  >
                    <Image source={require('./assets/tasks_little.png')}
                      style={{
                        width: '80%',
                        height: '80%',
                        alignSelf: 'center',
                      }} resizeMode="contain" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </View>
      </UserProvider>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  container: {
    flex: 1
  },
  rectangle: {
    width: 278,
    height: 82,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    left: 8
  },
  profileIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 0
  },
  circle: {
    width: 73,
    height: 73,
    borderRadius: 73 / 2,
    backgroundColor: 'lightblue',
    left: 10,
    zIndex: 1,
  },
  textContainer: {
    marginLeft: 10
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    //fontFamily: 'Inter',
    fontSize: 15,
    //fontStyle: 'normal',
    //fontWeight: '300',
    lineHeight: 28,
    letterSpacing: 1.2
  },
  rectanglesContainer: {
    flexDirection: 'column',
    marginLeft: -5,
    zIndex: 0
  },
  rectangle1: {
    width: 133,
    height: 26,
    backgroundColor: '#AD00D1',
    borderRadius: 13,
    marginBottom: 0, // Adjust as needed
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  rectangle2: {
    width: 133,
    height: 26,
    backgroundColor: '#AE03B9',
    borderRadius: 13,
    //justifyContent: 'center',
    //alignItems: 'center',
    marginLeft: -5
  },
  newRectanglesContainer: {
    flexDirection: 'row',
    marginTop: 5, // Adjust as needed
    justifyContent: 'center',
    zIndex: 1
  },
  newRectangle: {
    width: 133,
    height: 26,
    borderRadius: 13,
    marginRight: 50, // Adjust as needed
  },
  newRectangle2: {
    width: 133,
    height: 26,
    borderRadius: 13,
    // No marginBottom needed
  },
  newSmallRectanglesContainer: {
    flexDirection: 'row',
    marginTop: -7, // Adjust as needed
    justifyContent: 'center',
    zIndex: 0
  },
  newRectangle3: {
    width: 98,
    height: 26,
    borderRadius: 13,
    marginRight: 85, // Adjust as needed
  },
  newRectangle4: {
    width: 98,
    height: 26,
    borderRadius: 13,
    // No marginBottom needed
  },
  tasksInfoContainer: {
    flexDirection: 'row',
    marginTop: 20, // Adjust as needed
    justifyContent: 'center',
  },
  tasksInfo1: {
    width: 100,
    height: 26,
    borderRadius: 13,
    marginRight: 18, // Adjust as needed
  },
  tasksInfo2: {
    width: 100,
    height: 26,
    borderRadius: 13,
    marginRight: 18, // Adjust as needed
  },
  tasksInfo3: {
    width: 100,
    height: 26,
    borderRadius: 13,
    // No marginBottom needed
  },
  tasksInfoValuesContainer: {
    flexDirection: 'row',
    marginTop: 2, // Adjust as needed
    justifyContent: 'center',
  },
  tasksInfoValue1: {
    width: 34,
    height: 34,
    borderRadius: 12,
    marginRight: 85, // Adjust as needed
  },
  tasksInfoValue2: {
    width: 34,
    height: 34,
    borderRadius: 12,
    marginRight: 85, // Adjust as needed
  },
  tasksInfoValue3: {
    width: 34,
    height: 34,
    borderRadius: 12,
    // No marginBottom needed
  },
  pageNamesContainer: {
    flexDirection: 'row',
    marginTop: 15, // Adjust as needed
    justifyContent: 'center',
    zIndex: 1
  },
  pageName1: {
    width: 85,
    height: 20,
    borderRadius: 13,
    marginRight: 90, // Adjust as needed

  },
  pageName2: {
    width: 85,
    height: 20,
    borderRadius: 13,
    // No marginBottom needed
  },
  smallText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    //fontWeight: '300',
    lineHeight: 21,
    letterSpacing: 1.2
  },
  pagesContainer: {
    flexDirection: 'row',
    marginTop: -5, // Adjust as needed
    justifyContent: 'center',
  },
  page1: {
    width: 125,
    height: 125,
    borderRadius: 12,
    marginRight: 50, // Adjust as needed
    justifyContent: 'center'
  },
  page2: {
    width: 125,
    height: 125,
    borderRadius: 12,
    // No marginBottom needed
    justifyContent: 'center'
  },
  pageNamesContainer2: {
    flexDirection: 'row',
    marginTop: 15, // Adjust as needed
    justifyContent: 'center',
    zIndex: 1
  },
  pageName3: {
    width: 85,
    height: 20,
    borderRadius: 13,
    marginRight: 90, // Adjust as needed
  },
  pageName4: {
    width: 85,
    height: 20,
    borderRadius: 13,
    // No marginBottom needed
  },
  pagesContainer2: {
    flexDirection: 'row',
    marginTop: -5, // Adjust as needed
    justifyContent: 'center',
  },
  page3: {
    width: 125,
    height: 125,
    borderRadius: 12,
    marginRight: 50, // Adjust as needed
    justifyContent: 'center'
  },
  page4: {
    width: 125,
    height: 125,
    borderRadius: 12,
    // No marginBottom needed
    justifyContent: 'center'
  },
})

export default Profile
