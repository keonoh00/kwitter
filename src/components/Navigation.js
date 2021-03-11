import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "fBase";
import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
  const signOut = () => {
    authService.signOut();
    window.confirm("Successfully Signed Out");
  }
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50}}>
        <li>
          <Link to="/" style={{ marginRight:10 }}>
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          </Link>
        </li>
        <li>
          <Link 
            to="/profile"
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            <span style={{marginTop: 10}}>
              {userObj.displayName
                ? `${userObj.displayName}'s Profile`
                : "Profile"
              }
            </span>
          </Link>
        </li>
        <li>
          <span className="NavSignOut" onClick={signOut} >
            Sign Out
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;