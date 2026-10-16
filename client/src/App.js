import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import PrivateRoute from "./components/Routes/Private";
import Spinner from "./components/Spinner";

// these pages are loaded only when someone opens them
const CartPage = lazy(() => import("./pages/CartPage"));
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const Orders = lazy(() => import("./pages/user/Orders"));
const Profile = lazy(() => import("./pages/user/Profile"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const CreateCategory = lazy(() => import("./pages/Admin/CreateCategory"));
const CreateProduct = lazy(() => import("./pages/Admin/CreateProduct"));
const UpdateProduct = lazy(() => import("./pages/Admin/UpdateProduct"));
const Products = lazy(() => import("./pages/Admin/Products"));
const Users = lazy(() => import("./pages/Admin/Users"));
const AdminOrders = lazy(() => import("./pages/Admin/AdminOrders"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<CartPage />} />

        {/* user dashboard */}
        <Route path="/dashboard/user" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* admin dashboard */}
        <Route path="/dashboard/admin" element={<PrivateRoute adminOnly />}>
          <Route index element={<AdminDashboard />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="product/:slug" element={<UpdateProduct />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
