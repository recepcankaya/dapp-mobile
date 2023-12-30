
import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Font from 'expo-font'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { TokenContext } from './context/TokenContext'
import axios from 'axios'
import { UserContext, UserProvider } from './context/UserContext';
import { MissionContext } from './context/MissionContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
  baseURL: 'https://akikoko.pythonanywhere.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

type TabParamList = {
  'Tasks List': { taskText: string };
};

type TasksListRouteProp = RouteProp<TabParamList, 'Tasks List'>;

type CustomTextProps = {
  style?: object,
  children: React.ReactNode
}

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

const getImageSource = (text: string) => {
  if (text && text.toLowerCase().includes('read')) {
    return require('./assets/book.png');
  } else if (text && text.toLowerCase().includes('run')) {
    return require('./assets/running.png');
  } else {
    return require('./assets/null_image.png');
  }
};

type TasksListNavigationProp = BottomTabNavigationProp<TabParamList, 'Tasks List'>;

const TasksList: React.FC<{
  navigation: TasksListNavigationProp;
  route: TasksListRouteProp;
}> = ({ navigation, route }) => {
  const [taskText, setTaskText] = useState('');

  // const [tokens, setTokens] = useState({ access:'', refresh:'' });
  // const [username, setUsername] = useState('');
  // const [missions, setMissions] = useState<any[]>([]);

  // // Add a loading state
  // const [loading, setLoading] = useState(true);

  // const getTokensAndUsername = async () => {
  //   const storedTokens = await AsyncStorage.getItem('authTokens');
  //   const storedUsername = await AsyncStorage.getItem('username');

  //   // Parse the stringified tokens back into an object
  //   const parsedTokens = JSON.parse(storedTokens || '{}');

  //   // Set the tokens and username state variables
  //   setTokens(parsedTokens);
  //   setUsername(storedUsername || '');

  //   // Set loading to false
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   // Call getTokensAndUsername when the component mounts
  //   getTokensAndUsername();
  // }, []);

  const { tokens } = useContext(TokenContext);
  const [missions, setMissions] = useState<any[]>([]);
  const { username } = useContext(UserContext);
  const [missions_list, setMissions_list] = useContext(MissionContext);

  const completeMission = async (id: any) => {
    const url = `https://akikoko.pythonanywhere.com/api/mission/complete/${id}/`;
    const headers = {
      'Authorization': `Bearer ${tokens?.access}`
    };

    try {
      const response = await axios.patch(url, id, { headers });
      if (response.status === 200) {
        console.log(response.data);
        Alert.alert(response.data.message);
        getMissions();
      }
    } catch (error) {
      //console.error(error);
      if ((error as any).response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Alert.alert((error as any).response.data.message);
        console.log((error as any).response.data);
        console.log((error as any).response.status);
      } else if ((error as any).request) {
        // The request was made but no response was received
        console.log((error as any).request);
        console.log(id);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', (error as any).message);
      }
    }
  };

  const deleteMission = (id: any) => {
    const url = `https://akikoko.pythonanywhere.com/api/mission/delete/${id}/`; // replace with the actual URL
    const headers = {
      'Authorization': `Bearer ${tokens?.access}`
    };

    axios.delete(url, { headers })
      .then(response => {
        //console.log(response.data);
        //console.log(response)
        setTimeout(getMissions, 2000);
        console.log('Mission deleted successfully');
        Alert.alert('Mission Deleted');
        getMissions();
        if (response.request === 204) {
          console.log('Mission deleted successfully');
          console.log(response.status)
        }
      })
      .catch(error => {
        if ((error as any).response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log((error as any).response.data);
          // console.log((error as any).response.status);
          //console.log(id);
        } else if ((error as any).request) {
          // The request was made but no response was received
          setTimeout(getMissions, 2000);
          console.log('Mission deleted successfully');
          Alert.alert('Mission Deleted');
          getMissions();
          // console.log((error as any).request);
          // console.log((error as any).response.status);
          // console.log(id);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', (error as any).message);
          // console.log((error as any).response.status);
          // console.log(error.response);
          setTimeout(getMissions, 2000);
          console.log('Mission deleted successfully');
          Alert.alert('Mission Deleted');
          getMissions();
        }
      });
  };


  useEffect(() => {
    if (route.params && route.params.taskText) {
      setTaskText(route.params.taskText);
    } else {
      setTaskText('run');
    }
  }, [route.params]);

  const getMissions = async () => {
    const url = '/user/mission_list/'; // replace with the actual endpoint

    const headers = {
      'Authorization': `Bearer ${tokens?.access}`
    };

    try {
      const response = await api.get(url, { headers });
      setMissions_list(response.data);
      setMissions(response.data);
    } catch (error) {
      console.error(error);
      if ((error as any).response) {
        console.log((error as any).response.data);
        console.log((error as any).response.status);
      } else if ((error as any).request) {
        console.log((error as any).request);
      } else {
        console.log('Error', (error as any).message);
        console.log(error);

      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getMissions();
    }, [])
  );


  return (
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
            <View style={styles.tasksContainer}>
              <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                <View>
                  {missions.map((mission: any, index: number) => (
                    <View key={index} style={styles.tasksViewContainer}>
                      <View style={styles.tasksViewTopContainer}>
                        <Text style={styles.textOutput}>
                          {mission.title}
                        </Text>
                        <Image source={getImageSource(mission.title)} style={styles.image} />
                      </View>
                      <View style={styles.tasksViewIconContainer}>
                        <TouchableOpacity onPress={() => completeMission(mission.id)}>
                          <Image source={require('./assets/ic_positive_green.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <View style={styles.polygonContainer}>
                          <View style={styles.polygonIcon}>
                            <Image source={require('./assets/polygon_right.png')} style={[styles.icon, styles.polygonLeft]} />
                            <Text style={styles.polygonNumberRight}>{mission.numberOfDays}</Text>
                          </View>
                          <View style={styles.polygonIcon}>
                            <Image source={require('./assets/polygon_left.png')} style={[styles.icon, styles.polygonRight]} />
                            <Text style={styles.polygonNumberLeft}>21</Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => deleteMission(mission.id)}>
                          <Image source={require('./assets/ic_negative_red.png')} style={styles.icon} />
                        </TouchableOpacity>
                      </View>

                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </UserProvider>
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
  profileIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 0,
    position: 'relative'
  },
  circle: {
    width: 73,
    height: 73,
    borderRadius: 73 / 2,
    backgroundColor: 'lightblue',
    left: 10,
    elevation: 1,
    zIndex: 1
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 15,
    fontStyle: 'normal',
    //fontWeight: '300',
    lineHeight: 28,
    letterSpacing: 1.2
  },
  rectanglesContainer: {
    flexDirection: 'column',
    marginLeft: -5,
    elevation: 0,

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
    marginLeft: -5,

  },
  tasksContainer: {
    flexDirection: "column",
    width: '100%',
    height: '100%',
    //backgroundColor: 'red',
    marginTop: -10,
    padding: 10,
  },
  tasksViewContainer: {
    width: 350,
    height: 151,
    borderRadius: 32,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: "center",
    padding: 10,
    marginTop: 5,
  },
  tasksViewTopContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  textOutput: {
    marginTop: 5,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    textAlign: 'left',
    fontSize: 20,
    paddingLeft: 10
  },
  polygonContainer: {
    flexDirection: 'row',
    width: 50,
    marginLeft: 30,
    marginRight: 60,
    position: 'relative'
  },
  tasksViewIconContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  polygonIcon: {
    position: 'relative',
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  polygonNumberRight: {
    position: 'absolute',
    color: '#000',
    fontSize: 14,
    top: '17%',
    left: '33%',
  },
  polygonNumberLeft: {
    position: 'absolute',
    color: '#000',
    fontSize: 14,
    top: '17%',
    left: '30%',
  },
  polygonLeft: {
    right: -5, // adjust this value as needed
  },
  polygonRight: {
    left: -7, // adjust this value as needed
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
})

export default TasksList

