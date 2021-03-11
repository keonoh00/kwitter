import { authService, firebaseInstance } from "fBase";
import React, { useState } from "react";
import { useHistory } from "react-router";

const Auth = () => {
  const history = useHistory()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccont] = useState(true);

  
  const onChange = (event) => {
    const {target: {name, value}} = event;
    if (name === "email") {
      setEmail(value);
    } else if (name==="password") {
      setPassword(value);
    }
  };


  const onSubmit = async(event) => {
    event.preventDefault();
    try {
      let user;
      if (newAccount) {
        user = await authService.createUserWithEmailAndPassword(email, password);
      } else {
        user = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(user);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleAcount = () => {setNewAccont(prev => !prev);}



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
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
        <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      </form>
      <button onClick={toggleAcount}>{newAccount? "Log In" : "Create Account"}</button>
      <div>
        <button name="googleSignIn" onClick={onSocialClick}>Continue with Google</button>
        <button name="githubSignIn" onClick={onSocialClick}>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
