// components/Header.tsx
const Header = () => (
  <header style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: 80,
    background: "rgba(40,40,40,0.9)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    zIndex: 1000,
  }}>
    {/* logo, menu, ... */}
    Khon Kaen University | Resource
  </header>
);

export default Header;
