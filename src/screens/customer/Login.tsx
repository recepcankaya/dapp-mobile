import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useAddress,
  ConnectEmbed,
  useSigner,
  useWallet,
} from "@thirdweb-dev/react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import { utils } from "ethers";
import { sha512 } from "js-sha512";

import supabase from "../../lib/supabase";
import useUserStore from "../../store/userStore";
import colors from "../../ui/colors";

const Login = () => {
  const signer = useSigner();
  const walletAddr = useAddress();
  const embeddedWallet = useWallet("embeddedWallet");
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const updateUser = useUserStore((state) => state.setUser);

  const checkIfEmbeddedWallet = async () => {
    const email = await embeddedWallet?.getEmail();
    if (email) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Handles the login process with SIWE.
   *
   * @returns {Promise<void>} A promise that resolves when the login process is completed.
   * @throws {Error} If the wallet address is undefined or if there is an error during the login process.
   */
  const signIn = async (): Promise<void> => {
    try {
      let isNewUser = false;
      if (!walletAddr) {
        throw new Error("Lütfen giriş yapınız.");
      }

      const passwordHash = sha512(
        `${walletAddr}${process.env.HASH_SALT}`
      ).slice(0, 50);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${walletAddr}@ladderuser.com`,
        password: passwordHash,
      });

      if (error) {
        isNewUser = true;
        const {
          data: { user },
        } = await supabase.auth.signUp({
          email: `${walletAddr}@ladderuser.com`,
          password: passwordHash,
        });

        if (!user) {
          return;
        }

        await supabase
          .from("users")
          .update({ wallet_addr: walletAddr })
          .eq("id", user?.id);
      } else {
        await supabase
          .from("users")
          .update({
            last_login: String(new Date().toISOString()),
            wallet_addr: walletAddr,
          })
          .eq("id", data.user?.id);
      }

      if (isNewUser) {
        navigation.navigate("User Info");
      } else {
        navigation.navigate("TabNavigator");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.form}>
        {walletAddr ? (
          <>
            <Text style={styles.header}>Girişiniz yapılmıştır.</Text>
            <Text style={styles.subheader}>
              Devam etmek için lütfen aşağıdaki butona tıklayın
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={signIn}>
              <Text style={styles.buttonText}>Devam Et</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ConnectEmbed
            modalTitle="Sign In"
            modalTitleIconUrl=""
            container={{ paddingVertical: "lg", borderRadius: "lg" }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Admin Login")}
        style={styles.businessButton}>
        <Text style={styles.businessText}>
          İşletmeyseniz Lütfen Giriş Yapmak için {"\n"}Tıklayınız
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
  },
  form: {
    height: 500,
    width: "90%",
    alignSelf: "center",
  },
  header: {
    fontSize: 26,
    color: colors.white,
    marginBottom: 100,
  },
  subheader: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 50,
  },
  continueButton: {
    borderWidth: 2,
    borderColor: colors.pink,
    width: "80%",
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 24,
    color: colors.white,
  },
  businessButton: {
    width: "90%",
    alignSelf: "center",
  },
  businessText: {
    fontSize: 18,
    color: colors.white,
  },
});

export default Login;
