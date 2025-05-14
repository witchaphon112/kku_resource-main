import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // กลับไปบนสุดทุกครั้งเมื่อ pathname เปลี่ยน
  }, [pathname]);

  return null;
};

export default ScrollToTop; // ❗ ต้องมี default export
