
import { useState, useEffect, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Dimensions,
    TextInput,
    Alert,
} from 'react-native';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { TokenContext } from './context/TokenContext';
import { UserContext } from './context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'https://akikoko.pythonanywhere.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

interface CustomTextProps {
    style: any;
    children: React.ReactNode;
}

type TabParamList = {
    'LoginInner': { access?: string; refresh?: string };
    // other tabs...
};

const CustomText = (props: CustomTextProps) => {
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

const LoginInner = () => {

    const handleUsernameChange = (text: string) => {
        setUsername_x(text);
        setUsername(text);
    };


    const [loggedIn, setLoggedIn] = useState(false);

    const { height } = Dimensions.get('window');
    const statusBarHeight = StatusBar.currentHeight || 0;
    const imageHeight = height - statusBarHeight;
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [errorMessage, setErrorMessage] = useState(null);

    const [username_x, setUsername_x] = useState('');
    const [password_x, setPassword_x] = useState('');

    const { username, setUsername } = useContext(UserContext);

    const { setTokens } = useContext(TokenContext);


    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (loggedIn) {
            timer = setTimeout(() => {
                navigation.navigate('ProfileTab');
            }, 3000); // 3 seconds
        }

        return () => clearTimeout(timer); // cleanup on unmount
    }, [loggedIn, navigation]);


    const handleLogin = () => {

        api.post('/auth/get_token/', {
            username: username_x,
            password: password_x,
        })

            //async code
            // .then(response => {
            //     if (response.status === 200) {
            //         setLoggedIn(true);
            //         setTokens({ access: response.data.access, refresh: response.data.refresh });
            //         AsyncStorage.setItem('authTokens', JSON.stringify({ access: response.data.access, refresh: response.data.refresh }));
            //         AsyncStorage.setItem('username', username_x);
            //         navigation.navigate('ProfileTab');
            //         //navigation.navigate('test');
            //     } else {
            //         // Handle other status codes here
            //     }
            // })
            .then(response => {
                if (response.status === 200) {
                    setLoggedIn(true);
                    setTokens({ access: response.data.access, refresh: response.data.refresh });
                    navigation.navigate('ProfileTab');
                    //navigation.navigate('test');
                } else {
                    // Handle other status codes here
                }
            })
            .catch(error => {
                console.log(error.response.data);
                Alert.alert('Error', error.message);
                setErrorMessage(error.message);
            });
    };

    return (
        <>
            <StatusBar backgroundColor='transparent' translucent={true} />
            <View style={styles.container}>
                <LinearGradient
                    colors={['#9600BC', '#000936']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.4, y: 1 }}
                    style={styles.gradient}
                    locations={[0.1885, 1.2]}>
                    <ImageBackground
                        source={require('./assets/Checks.png')}
                        style={[
                            styles.background,
                            { height: imageHeight, marginTop: statusBarHeight },
                        ]}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputBox}>
                                <CustomText style={styles.inputText}>
                                    Username
                                </CustomText>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your username"
                                    placeholderTextColor="#fff"
                                    value={username_x}
                                    onChangeText={handleUsernameChange}
                                    autoCapitalize='none'
                                />
                            </View>
                            <View style={styles.inputBox}>
                                <CustomText style={styles.inputText}>
                                    Password
                                </CustomText>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#fff"
                                    secureTextEntry={true}
                                    value={password_x}
                                    onChangeText={setPassword_x}
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                        {loggedIn ? (
                            <View style={styles.buttonContainer}>
                                <CustomText style={styles.buttonText}>
                                    Logging in...
                                </CustomText>
                            </View>
                        ) : (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleLogin}>
                                    <CustomText style={styles.buttonText}>
                                        Login
                                    </CustomText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ImageBackground>
                </LinearGradient>
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
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        width: 317,
        height: 90,
        borderRadius: 42,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    inputText: {
        color: '#000',
        fontFamily: 'Zen Dots',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 317,
        height: 72,
        borderRadius: 42,
        backgroundColor: '#AD00D1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'Zen Dots',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
    },
    input: {
        width: 250,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default LoginInner;
