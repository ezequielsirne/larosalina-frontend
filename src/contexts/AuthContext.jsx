import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { getByToken, useTokenExpiration } from "../services/usersServices";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";

const AUTH_TOKEN = "AUTH_TOKEN";
const AUTH_USER = "AUTH_USER";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState();

  const handleLoginSession = useCallback(function (user, token) {
    window.sessionStorage.setItem(AUTH_USER, JSON.stringify(user));
    window.sessionStorage.setItem(AUTH_TOKEN, token);
    setToken(window.sessionStorage.getItem(AUTH_TOKEN));
    setUser(JSON.parse(window.sessionStorage.getItem(AUTH_USER)));
    setIsAuthenticated(true);
  }, []);

  const handleLoginLocal = useCallback(function (user, token) {
    //local
    window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
    window.localStorage.setItem(AUTH_TOKEN, token);
    //session
    window.sessionStorage.setItem(AUTH_USER, JSON.stringify(user));
    window.sessionStorage.setItem(AUTH_TOKEN, token);
    setToken(window.sessionStorage.getItem(AUTH_TOKEN));
    setUser(JSON.parse(window.sessionStorage.getItem(AUTH_USER)));
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(function () {
    window.sessionStorage.removeItem(AUTH_USER);
    window.localStorage.removeItem(AUTH_USER);
    window.sessionStorage.removeItem(AUTH_TOKEN);
    window.localStorage.removeItem(AUTH_TOKEN);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(AUTH_TOKEN) !== null) {
      if (
        new Date() >
        new Date(jwt_decode(window.localStorage.getItem(AUTH_TOKEN)).exp * 1000)
      ) {
        swal({
          text: "Tu sesión ha expirado",
          icon: "info",
          button: "Aceptar",
        });
        handleLogout();
        return;
      }
      setToken(window.localStorage.getItem(AUTH_TOKEN));
      setUser(JSON.parse(window.localStorage.getItem(AUTH_USER)));
      //session
      window.sessionStorage.setItem(
        AUTH_TOKEN,
        window.localStorage.getItem(AUTH_TOKEN)
      );
      window.sessionStorage.setItem(
        AUTH_USER,
        window.localStorage.getItem(AUTH_USER)
      );
      setIsAuthenticated(true);
    }
    if (window.sessionStorage.getItem(AUTH_TOKEN) !== null) {
      if (
        new Date() >
        new Date(
          jwt_decode(window.sessionStorage.getItem(AUTH_TOKEN)).exp * 1000
        )
      ) {
        swal({
          text: "Tu sesión ha expirado",
          icon: "info",
          button: "Aceptar",
        });
        handleLogout();
        return;
      }
      setToken(window.sessionStorage.getItem(AUTH_TOKEN));
      setUser(JSON.parse(window.sessionStorage.getItem(AUTH_USER)));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      handleLoginSession,
      handleLoginLocal,
      handleLogout,
      isAuthenticated,
      token,
      user,
    }),
    [
      isAuthenticated,
      token,
      user,
      handleLoginSession,
      handleLoginLocal,
      handleLogout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthContextProvider.propTypes = {
  children: PropTypes.object,
};

export function useAuthContext() {
  return useContext(AuthContext);
}
