import { faGithub, faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fBase";
import React from "react";
import { useHistory } from "react-router";

const Auth = () => {
  const history = useHistory();


  // --------------------------- Social Login Below --------------------------- //


  const onSocialClick = async(event) => {
    const { target: { name } } = event;
    let provider;
    if (name === "googleSignIn") {
      // google signin
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "githubSignIn") {
      //github sign in
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    try {
      await authService.signInWithPopup(provider);
      history.push("/")
    } catch(error) {
      if (error.message === "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.") {
        alert("You already have an account with same email\r\nTry other Sign In Method");
      }
    }
    // await authService.signInWithPopup(provider);
  }
  return ( 
    <div className="authContainer">
      <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" style={{ marginBottom: 30 }} />
      <AuthForm />
      <div className="authBtns">
        <button name="googleSignIn" onClick={onSocialClick} className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button name="githubSignIn" onClick={onSocialClick} className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
