import { View, StyleSheet, StatusBar, Alert, Button, Text } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  useAddress,
  ConnectEmbed,
  useSigner,
  useDisconnect,
  useWallet,
} from "@thirdweb-dev/react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

import supabase from "../lib/supabase";

const Login = () => {
  const address = useAddress();
  const signer = useSigner();
  const walletAddr = useAddress();
  const disconnect = useDisconnect();
  const embeddedWallet = useWallet("embeddedWallet");
  const navigation = useNavigation();

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
  // @todo - kullanıcı yeni nonce' ı reddetse bile nonce değişiyor. bunun önüne geç.
  const handleLoginWithSIWE = async () => {
    try {
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
        let { data } = await supabase
          .from("users")
          .insert({ nonce, walletAddr });
        console.log(
          `Checkpoint 1: Inserted new user with nonce: ${nonce} walletAddr: ${walletAddr} data: ${data}`
        );
      } else {
        // new nonce
        await supabase.from("users").update({ nonce }).match({ walletAddr });
        console.log(
          `Checkpoint 1: Inserted new user with nonce: ${nonce} walletAddr: ${walletAddr}`
        );
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
        console.log(
          "Checkpoint 2: Signature is created with embedded wallet ",
          signature
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
        console.log("Checkpoint 2: Signature is created with EOA ", signature);
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

      console.log("Checkpoint 3: User data is ", user);

      const jwtToken = jwt.sign(
        {
          sub: user.id,
          walletAddr,
          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 90),
          user_metadata: {
            id: user.id,
          },
        },
        "g0gRho4kgKR47SqQpa7z4rYzZrjgOQGCj8FA7v0VBkguG+MpWe7BGR+kwENTExL19ts8RTCnaQbOBWoCFG6LsA=="
      );

      console.log("Checkpoint 4: JWT token is created ", jwtToken);

      supabase.functions.setAuth(jwtToken);
      supabase.realtime.setAuth(jwtToken);
      await supabase.auth.setSession({
        access_token: jwtToken,
        refresh_token: jwtToken,
      });

      console.log("Successfull login with siwe");
    } catch (error) {
      console.log("Error when logging is ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.form}>
        <ConnectEmbed
          modalTitle="Sign In"
          modalTitleIconUrl=""
          container={{ paddingVertical: "lg", borderRadius: "lg" }}
        />
      </View>
      <Text style={{ color: "#fff" }}>Address is {address}</Text>
      <Button title="Login with SIWE" onPress={handleLoginWithSIWE} />
      <Button title="disconnect" onPress={() => disconnect()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
  },
  form: {
    width: "80%",
    alignSelf: "center",
  },
});

export default Login;
