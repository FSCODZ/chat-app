import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";
import StartPage from "./components/StartPage";
import SideNav from "./components/SideNav";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/chat"
              element={
                <div style={{ display: "flex" }}>
                  <SideNav />
                  <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
                    <Chat />
                  </div>
                </div>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

const ProtectedRoute = () => {
  const { authState } = useContext(AuthContext);
  const jwt = authState.token ? authState.token : localStorage.getItem("token");

  return jwt ? <Outlet /> : <Navigate to="/login" />;
};

export default App;
