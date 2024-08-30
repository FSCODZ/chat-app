import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "./SideNav.css";

const SideNav = () => {
  const { handleLogout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <span onClick={toggleNav} className="openbtn">
        ☰ 
      </span>
      <div className={`sidenav ${isOpen ? "open" : ""}`}>
        <button className="closebtn" onClick={toggleNav}>
          &times;
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={`main-content ${isOpen ? "shift" : ""}`}></div>
    </>
  );
};

export default SideNav;
