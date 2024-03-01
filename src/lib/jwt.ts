const base64url = (source: string) => {
  // Encode in base64
  let encodedSource = Buffer.from(source).toString("base64");

  // Make it URL safe
  encodedSource = encodedSource.replace(/=/g, "");
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");

  return encodedSource;
};

const signToken = (payload: object, secretKey: string) => {
  // Header
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // Payload
  const base64Header = base64url(JSON.stringify(header));
  const base64Payload = base64url(JSON.stringify(payload));

  // Signature
  const signature = base64url(
    require("react-native-crypto")
      .createHmac("sha256", secretKey)
      .update(`${base64Header}.${base64Payload}`)
      .digest("base64")
  );

  // JWT
  return `${base64Header}.${base64Payload}.${signature}`;
};

export default signToken;
