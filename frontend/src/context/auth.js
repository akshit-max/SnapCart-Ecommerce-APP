import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

const loadAuth = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("auth"));
    if (saved?.token) return { user: saved.user, token: saved.token };
  } catch {
    // bad data in storage, start logged out
  }
  return { user: null, token: "" };
};

const AuthProvider = ({ children }) => {
  // read from localStorage right away so protected pages don't flash a logged out state
  const [auth, setAuth] = useState(loadAuth);

  //default axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    if (auth.token) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  // token expired or invalid -> log the user out
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && localStorage.getItem("auth")) {
          setAuth({ user: null, token: "" });
          toast.error("Session expired, please login again");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
