import { authService } from "fBase";
import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
  const signOut = () => {
    authService.signOut();
    window.confirm("Successfully Signed Out");
    window.location.replace("/");
  }
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">{userObj.displayName}'s Profile</Link></li>
        <li onClick={signOut}>Sign Out</li>
      </ul>
    </nav>
  );
};

export default Navigation;