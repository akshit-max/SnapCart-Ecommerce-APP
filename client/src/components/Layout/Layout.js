
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from "react-helmet";
import { Toaster} from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';


const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
      </Helmet>

      <Header />
      <main style={{ minHeight: '70vh' ,marginTop: '70px' ,marginBottom: '100px'}}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Default props must be set outside the function component
Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "MERN stack project",
  keywords: "mern, react, node, mongodb",
  author: "Techinfoyt"
};

export default Layout;
