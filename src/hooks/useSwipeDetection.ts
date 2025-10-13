import { useState } from "react";

// this hook is not working anywhere in the code. I will use this hook latter.
const useSwipeDetection = () => {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "">(
    ""
  );

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        console.log("Swiped Right");
        setSwipeDirection("right");
      } else if (diffX < -50) {
        console.log("Swiped Left");
        setSwipeDirection("left");
      }
    } else {
      if (diffY > 50) {
        console.log("Swiped Down");
      } else if (diffY < -50) {
        console.log("Swiped Up");
      }
    }
  };

  return { swipeDirection, handleTouchStart, handleTouchEnd };
};

export default useSwipeDetection;
