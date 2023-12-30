
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './components/LoginPage';
import LoadingScreen from './components/LoadingScreen';
import Profile from './components/Profile';
import AddTask from './components/AddTask';
import TasksList from './components/TasksList';
import { Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import LoginInner from './components/login';
import Register from './components/register';
import { TokenContext, TokenProvider } from './components/context/TokenContext';
import { UserProvider } from './components/context/UserContext';
import { MissionContext, MissionProvider } from './components/context/MissionContext';
import newLogin from './components/newLogin'
import newSignUp from './components/newSignUp'

type TabParamList = {
  'Profile': undefined;
  'Add Task': undefined;
  'Tasks List': { taskText: string };
  'LoginInner': undefined;
  'Register': undefined;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<TabParamList>();

function ProfileTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='Profile'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: 'flex',
            backgroundColor: '#003172'
          },
          null,
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let isProfile;

          if (route.name === 'Add Task') {
            iconName = focused
              ? require('./assets/ic_positive.png')
              : require('./assets/ic_positive.png');
          } else if (route.name === 'Profile') {
            iconName = focused
              ? require('./assets/LadderLogo.png')
              : require('./assets/LadderLogo.png');
            isProfile = true;
          } else if (route.name === 'Tasks List') {
            iconName = focused
              ? require('./assets/tabbar_addtask.png')
              : require('./assets/tabbar_addtask.png');

          }

          // You can return any component that you like here!
          return isProfile ? (
            <LinearGradient
              colors={['#BF00BF', '#0505D5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 35,
                height: 33,
                flexShrink: 0,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image source={iconName} style={{ width: 30, height: 30 }} />
            </LinearGradient>
          ) : (
            <Image source={iconName} style={{ width: 25, height: 25 }} />
          );
        },
      })}
    >

      <Tab.Screen
        name="Add Task"
        component={AddTask}

      />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen
        name="Tasks List"
        component={TasksList}
        options={{
        }}
      />

    </Tab.Navigator>
  );
}
function App() {
  return (
    <TokenProvider>
      <UserProvider>
        <MissionProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Loading">
                <Stack.Screen
                  name="Loading"
                  component={LoadingScreen}
                  options={{ headerShown: false }} // Hide navigation bar on LoadingScreen
                />
                <Stack.Screen
                  name="Login"
                  component={LoginPage}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />

                <Stack.Screen
                  name="ProfileTab"
                  component={ProfileTabNavigator}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />

                <Stack.Screen
                  name="LoginInner"
                  component={LoginInner}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />
                <Stack.Screen
                  name="newLogin"
                  component={newLogin}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />
                <Stack.Screen
                  name="newSignUp"
                  component={newSignUp}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />
              </Stack.Navigator>
            </NavigationContainer>
        </MissionProvider>
      </UserProvider>
    </TokenProvider>
  );
}

export default App;