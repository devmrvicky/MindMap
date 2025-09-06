import { useState, useEffect, useRef } from "react";

export const useScrollDetection = () =>
  // elementRef: RefObject<HTMLDivElement | null>
  {
    const [scrollDirection, setScrollDirection] = useState<
      "up" | "down" | null
    >(null);
    const lastScrollY = useRef(window.pageYOffset);

    // window.addEventListener("scroll", () => {
    //   console.log("scrolling...");
    // });

    useEffect(() => {
      let ticking = false;

      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        if (scrollY === lastScrollY.current) return;

        const direction = scrollY > lastScrollY.current ? "down" : "up";
        if (direction !== scrollDirection) {
          setScrollDirection(direction);
        }
        lastScrollY.current = scrollY;
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollDirection);
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, [scrollDirection]);

    return {
      isScrollUp: scrollDirection === "up",
      isScrollDown: scrollDirection === "down",
      scrollDirection,
    };
  };
