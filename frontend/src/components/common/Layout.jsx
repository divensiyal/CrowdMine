import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-layout__content">
        {children}
      </main>
    </div>
  );
}

export default Layout;