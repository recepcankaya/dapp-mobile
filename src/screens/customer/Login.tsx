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
import bcrypt from "bcrypt";

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
  const handleLoginWithSIWE = async (): Promise<void> => {
    try {
      let isNewUser = false;
      if (!walletAddr) {
        throw new Error("Wallet address is undefined");
      }

      const nonce = uuidv4();
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(walletAddr, salt);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${walletAddr}@ladderuser.com ⁠`,
        password: passwordHash,
      });

      if (error) {
        isNewUser = true;
        const { data, error } = await supabase.auth.signUp({
          email: `${walletAddr}@ladderuser.com`,
          password: passwordHash,
        });
        await supabase
          .from("users")
          .update({ nonce, walletAddr })
          .eq("id", data.user?.id);
      } else {
        await supabase
          .from("users")
          .update({ nonce, last_login: new Date() })
          .eq("id", data.user?.id);
      }

      const siweMessage = {
        domain: "Ladder It",
        addres: walletAddr,
        statement: "Onaylama tuşuna basarak uygulamaya giriş yapabilirsiniz.",
        version: "1",
        chainId: "137",
        nonce,
      };

      const ifEmbeddedWallet = await checkIfEmbeddedWallet();
      if (ifEmbeddedWallet) {
        const signature = await embeddedWallet?.signMessage(
          siweMessage.statement
        );

        if (!signature) {
          throw new Error("Signature is undefined");
        }
        await embeddedWallet?.verifySignature(
          siweMessage.statement,
          signature,
          walletAddr,
          137
        );
      } else {
        const signature = await signer?.signMessage(siweMessage.statement);
        if (!signature) {
          throw new Error("Signature is undefined");
        }
        const signerAddr = utils.verifyMessage(nonce, signature);
        if (signerAddr !== walletAddr) {
          throw new Error("Signature verification failed.");
        }
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("walletAddr", walletAddr)
        .single();

      updateUser({
        id: user.id.toString(),
        username: user.username,
        lastLogin: user.last_login,
        walletAddr: user.wallet_addr,
      });

      if (isNewUser) {
        navigation.navigate("User Info");
      } else {
        navigation.navigate("TabNavigator");
      }
    } catch (error) {
      // Alert.alert(
      //   "Bunu biz de beklemiyorduk 🤔",
      //   "Lütfen tekrar dener misiniz 👉👈"
      // );
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
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleLoginWithSIWE}>
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
