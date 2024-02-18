import React, { useRef, forwardRef } from "react";
import ConfettiCannon from "react-native-confetti-cannon";

interface ConfettiProps {
  onAnimationEnd: () => void;
  onAnimationStart: () => void;
}

const Confetti = forwardRef<ConfettiCannon, ConfettiProps>((props, ref) => {
  const { onAnimationEnd, onAnimationStart } = props;
  return (
    <ConfettiCannon
      ref={ref}
      count={200}
      origin={{ x: -10, y: 0 }}
      onAnimationEnd={onAnimationEnd}
      onAnimationStart={onAnimationStart}
    />
  );
});

export default Confetti;
