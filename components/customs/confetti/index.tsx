import React, { useRef, forwardRef } from "react";
import ConfettiCannon from "react-native-confetti-cannon";

interface ConfettiProps {
  onAnimationEnd: () => void;
}

const Confetti = forwardRef<ConfettiCannon, ConfettiProps>((props, ref) => {
  const { onAnimationEnd } = props;
  return (
    <ConfettiCannon
      ref={ref}
      count={200}
      origin={{ x: -10, y: 0 }}
      onAnimationEnd={onAnimationEnd}
    />
  );
});

export default Confetti;
