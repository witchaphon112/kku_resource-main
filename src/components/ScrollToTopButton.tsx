import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const btnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "2.2rem",
  right: "2.2rem",
  zIndex: 12345,
  background: "#6e7682",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 56,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 16px rgba(51,51,51,0.2)",
  cursor: "pointer",
  fontSize: 28,
  opacity: 0.96,
  transition: "background 0.18s, transform 0.17s",
};

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 180);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      style={{
        ...btnStyle,
        background: visible ? "#6e7682" : "#c7c7c7",

      }}
      aria-label="เลื่อนขึ้นบนสุด"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      tabIndex={0}
      title="ขึ้นบนสุด"
      onMouseOver={e => (e.currentTarget.style.background = "#b71c1c")}
      onMouseOut={e => (e.currentTarget.style.background = "#6e7682")}
    >
      <FaArrowUp />
    </button>
  );
}
