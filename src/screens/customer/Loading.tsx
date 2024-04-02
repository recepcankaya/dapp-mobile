import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import useUserStore from "../../store/userStore";
import useAdminForAdminStore from "../../store/adminStoreForAdmin";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, AppState, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions } from '@react-navigation/native';
import colors from "../../ui/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";


AppState.addEventListener('change', (state) => {
    console.log('state', state);
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh()
    }
});

const Loading = () => {
    const userUpdate = useUserStore((state) => state.setUser);
    const admin = useAdminForAdminStore((state) => state.admin);
    const updateAdmin = useAdminForAdminStore((state) => state.updateAdmin);
    const [session, setSession] = useState<Session | null>(null);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            checkLogin(session);
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, []);

    const checkLogin = async (session: Session | null) => {
        AsyncStorage.getAllKeys().then((keys) => {
            console.log('keys', keys);
        })
        if (session && session.user) {
            const { data: user, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .single();
            if (error) {
                console.log('userError', error);
            }
            if (user) {
                console.log('user', user);
                userUpdate({
                    id: user.id.toString(),
                    username: user.username,
                });
                return navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Brands' }
                    ]
                }))
            }
            else {
                const { data: adminUser, error } = await supabase
                    .from("admins")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();
                if (error) {
                    console.log('adminError', error);
                }
                if (adminUser) {
                    console.log('admin', adminUser);
                    updateAdmin({
                        ...admin,
                        adminId: adminUser.id,
                    });
                    return navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Admin Home' }
                        ]
                    }))
                }
            }
        }
        return navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
                { name: 'Login' }
            ]
        }))
    }

    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator color={colors.purple} size={"large"} />
        </SafeAreaView>
    )
}

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black
    }
})