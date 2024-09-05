import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    id: null,
    username: null,
    avatar: null,
    csrfToken: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const username = sessionStorage.getItem("username");
    const avatar = sessionStorage.getItem("avatar");
    const csrfToken = sessionStorage.getItem("csrfToken");

    if (token) {
      setAuthState({ token, id, username, avatar, csrfToken });
    }
   
  }, []);

  const login = ({ token, id, username, avatar, csrfToken }) => {
    setAuthState({ token, id, username, avatar, csrfToken });
  };

  const handleLogout = () => {
    setAuthState({
      token: null,
      id: null,
      username: null,
      avatar: null,
      csrfToken: null,
    });
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authState, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
