import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Button,
  Text,
  Pressable,
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
import { ethers } from "ethers";

import supabase from "../../lib/supabase";
import signToken from "../../lib/jwt";
import useUserStore from "../../store/userStore";
import colors from "../../ui/colors";

const Login = () => {
  const address = useAddress();
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
  const handleLoginWithSIWE = async () => {
    try {
      let isNewUser = false;
      if (!walletAddr) {
        throw new Error("Wallet address is undefined");
      }

      const nonce = uuidv4();

      let { data } = await supabase
        .from("users")
        .select("nonce")
        .eq("walletAddr", walletAddr);

      if (data?.length === 0) {
        // create user record + nonce
        isNewUser = true;
        await supabase.from("users").insert({ nonce, walletAddr });
      } else {
        // new nonce
        await supabase
          .from("users")
          .update({ nonce, last_login: new Date() })
          .match({ walletAddr });
      }

      const siweMessage = {
        domain: "Ladder It",
        addres: walletAddr,
        statement: "Onaylama tuşuna basarak uygulamaya giriş yapabilirsiniz.",
        version: "1",
        chainId: "800001",
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
          80001
        );
      } else {
        const signature = await signer?.signMessage(siweMessage.statement);
        if (!signature) {
          throw new Error("Signature is undefined");
        }
        const signerAddr = ethers.utils.verifyMessage(nonce, signature);
        if (signerAddr !== walletAddr) {
          throw new Error("Signature verification failed.");
        }
      }

      let { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("walletAddr", walletAddr)
        .eq("nonce", nonce)
        .single();

      const secretKey =
        "g0gRho4kgKR47SqQpa7z4rYzZrjgOQGCj8FA7v0VBkguG+MpWe7BGR+kwENTExL19ts8RTCnaQbOBWoCFG6LsA==";

      const jwtToken = signToken(
        {
          sub: user.id,
          walletAddr,
          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 90),
          user_metadata: {
            id: user.id,
          },
        },
        secretKey
      );

      supabase.functions.setAuth(jwtToken);
      supabase.realtime.setAuth(jwtToken);
      await supabase.auth.setSession({
        access_token: jwtToken,
        refresh_token: jwtToken,
      });

      updateUser({
        id: user.id.toString(),
        username: user.username,
        numberOfNFTs: user.number_of_nfts,
        orderNumber: user.order_number,
      });

      if (isNewUser) {
        navigation.navigate("User Info");
      } else {
        navigation.navigate("Brands");
      }
    } catch (error) {
      Alert.alert(
        "Bunu biz de beklemiyorduk 🤔",
        "Lütfen tekrar dener misiniz 👉👈"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.form}>
        {address ? (
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
      <View></View>
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
