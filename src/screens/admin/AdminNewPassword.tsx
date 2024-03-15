import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, SafeAreaView, Text } from 'react-native';
import supabase from "../../lib/supabase";
import colors from '../../ui/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import updateAdminEmail from '../../store/adminId';

const AdminNewPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const email = updateAdminEmail((state) => state.adminEmail); // get the stored email

    const handleResetPassword = async () => {
        if (password !== passwordCheck) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        try {
            const { error } = await supabase.auth.updateUser({ email, password });
            if (error) {
                throw error;
            }
            Alert.alert('Success', 'Password reset successfully!');
            navigation.navigate('Admin Home');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.header}>Yeni Şifre</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Yeni Şifre"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Yeni Şifre Tekrar"
                        secureTextEntry
                        value={passwordCheck}
                        onChangeText={setPasswordCheck}
                        style={styles.input}
                    />
                    <Button title="Reset Password" onPress={handleResetPassword} />
                </View>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        backgroundColor: colors.pink,
        width: "100%",
        height: 60,
        borderRadius: 20,
        paddingLeft: 20,
        fontSize: 18,
    },
    formContainer: {
        width: "80%",
        height: 600,
        alignItems: "stretch",
        justifyContent: "center",
    },
    header: {
        color: colors.white,
        fontSize: 24,
        marginBottom: 40,
    },
    inputContainer: {
        width: "100%",
        gap: 40,
        marginBottom: 100,
    },
});

export default AdminNewPassword;