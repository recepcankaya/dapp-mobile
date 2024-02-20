import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  heightConstant,
  widthConstant,
} from "../customs/CustomResponsiveScreen";

const OpenEye = () => {
  return (
    <Svg
      width={26 * widthConstant}
      height={26 * widthConstant}
      viewBox={"0 0 " + 26 * widthConstant + " " + 26 * widthConstant + " "}
      fill="none"
    >
      <Rect
        width={26 * widthConstant}
        height={26 * widthConstant}
        fill="url(#pattern0)"
      />
      <Defs>
        <Pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#image0_680_6" transform="scale(0.0111111)" />
        </Pattern>
        <Image
          id="image0_680_6"
          width="90"
          height="90"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFbUlEQVR4nO2cXYhVVRSAv6vTqJmpY1MvUfRjYWWTlZCQUY2FxIRND0pEvWlSEFpB/5P1Ug8R9OCDCf3RQwWBPSRRNDb+RCONmgyjSH8PhfYzZmozI5Ynlq0Ll8GZuefctc/ZM3d9sOAyc+esnzln773WXvuA4ziO4ziO4ziO4ziO4ziOExnTgIXASmA98DnQC/wGHAESlSP6s179znr9mxuBqUU7ESOTgEXAK8Be4GRFMLOKXONb4GXgJtVRt9wCbAQOGQR2LDkIvAHcTJ0wBXgQ2JNDcEeS3cAq4GwmIDOAdcAfBQZ4uIgtLwDnMAE4S++egxEEdiT5HXhSn7ZxyT3ADxEEMqlSvgPuZhxxAfBuBIFLMsqHwPlEzgNAfwTBSgzG7/uJEJlQ3jN2dgjoBJ7XYWgeMFvH/Ub9fJX+rgPYon9jacM7wHQi4Vpgn6Fz32iGNzODLbN08u0xtKcPuJqCuQ8YMHKoB7jT0Laluma2sO1vYDkFUAKeA04ZODEAPApMDmBnA7AGGDSwU3x9hhyR8fFtoztlPzA/B5tbgANGNr+lMQiKLOo3GRm8E2gmP5qAHUa2b9YqY7A0eouRoV8XlPqKzm4jH74I4cO5Ghyr4WIOxXGe4TCyQ29AE6TK9aWRYYPAdRTPfMPV0naLtbaMyZ8ZGZTo6iIW1hr69WktRamScbbXE2gJl5XJhutskQ80ZqlZZ2hEYpyMWHGXsY9SLkid8VkkI5VpdS3codteMpEeV9mn21NLariu3IG7DP2UmK2oVvkio0yqUlZmDMQVQFcV15fJem5GHQ8Z+zqgG8KjcmGAzdKhjAUi2bw9nEKPfHdxBj1SBTxh7PMhjeWIdYGtxgoTLXVmuZPTBLksUgu/PLU2u+VrpXSNNPm/FEBZpgmC6oaLkUSy16In/rK8OFzRbcC/gZQtyzDx1aqzNaXO9kC+/wPcWlYiKeRPgRQlujOSho0GOjek0vh/YT+U/z+W0/RXAypJMtQ19hvolKVf2vpHyBhIjE83CoZU0pjS6WMGOuUaaZgSOAa/kkP3UGNKp48a6DwaWaClSYfXJ+DQ0RfZ0CExPt0s8ldAJfPqfDL8s3In6ZGAipaldHqJgc7bI1neiTxcqWiS4X7acOkg30ytM6KEZduZmuCvDFBMyur4JTqB5JWChyg9DGkn1Rl5IpDCWRmcX5yyj68/Y1GpKUBRSeSxseqzHwdQuopszK1y570z450srA7g76Zqdltma9qYGG9j1UKrriT6NBk5pp83ZJj4KikZb2eJfJ/mCV4YoDNzKfHRZuyjxOyGtEZYL/l2a807Fhr0uF0MQ6R51riGeLCe+F+rxRhZA35kaMwgsIA4erqtGmjKxzFqPjQ6zbDnLtF2LKktFEWzHgxKDHvwzI5ETzde1HcX2OS409CPrhBHL2YYp+ndOd/ZzcZB3h7yZpH/3ifGw0gL4VlgPFxszuOJbNCud8sJcm2gpZ9c83HjGs6beS5TS1rxsmwb26O9cCUj+9qM18mn9Oy4hX2pacvY6JKMIru0TUtKAVkKRKsDpNWH1ddCuTSAY4lW1Lr0LmrXXZA5ugfZqJ+vAe7Vp2troCpcj5Zto2CqvkHG4u0xSSRyUn2K8rVBLcanVpOCZK8W1qJGzmo/HXjDNwkk8kKsp9SHcUOTPnqDEQRwLDmhtW15Bca45WJtIbAs4ljJgJ4auIgJxEyt1/ZGEOAD+nqfIs87BqekrblyJ/2SY3B/1uGhtaiko0hKwPXa+/GVHgKyCuxxLfw8q7WOugvuaEjx/DJNUDr07N427cfr1/aqyhVCv/5OvvO+ni5o12vU9dsbHcdxHMdxHMdxHMdxHMdxiIv/AFyxU2gxdMHCAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  );
};

const BlindEye = () => {
  return (
    <Svg
      width={26 * widthConstant}
      height={26 * widthConstant}
      viewBox={"0 0 " + 26 * widthConstant + " " + 26 * widthConstant + " "}
      fill="none"
    >
      <Rect
        width={26 * widthConstant}
        height={26 * widthConstant}
        fill="url(#pattern0)"
      />
      <Defs>
        <Pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#image0_680_5" transform="scale(0.0111111)" />
        </Pattern>
        <Image
          id="image0_680_5"
          width="90"
          height="90"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
};

interface EyesProps {
  passwordVisible?: boolean;
  setPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Eyes = ({ passwordVisible, setPasswordVisible }: EyesProps) => {
  return (
    <TouchableOpacity
      style={styles.eye}
      onPress={() => {
        if (setPasswordVisible) setPasswordVisible((prev) => !prev);
      }}
    >
      {passwordVisible ? <OpenEye /> : <BlindEye />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eye: {
    height: 26 * widthConstant,
    width: 26 * widthConstant,
  },
});

export default Eyes;
