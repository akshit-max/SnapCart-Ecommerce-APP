import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, title }) => {
  useEffect(() => {
    document.title = title ? `${title} | SnapCart` : "SnapCart - Shop Online";
  }, [title]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1" style={{ marginTop: "80px", paddingBottom: "60px" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
