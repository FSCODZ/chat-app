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
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");
    const csrfToken = localStorage.getItem("csrfToken");

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
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authState, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
