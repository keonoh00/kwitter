import { authService } from "fBase";
import React, { useState } from "react";
import { useHistory } from "react-router";

const inputStyles = {};

const AuthForm = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccont] = useState(true);
  const [error, setError] = useState("");

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
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
      history.push("/profile")
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAcount = () => {setNewAccont(prev => !prev);}

  return (
    <>
      <form onSubmit={onSubmit} className="container">
          <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} className="authInput" />
          <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className="authInput" />
          <input type="submit" value={newAccount ? "Create Account" : "Log In"} className="authInput authSubmit" />
          {error && <span className="authError">{error}</span>}
        </form>
        <button onClick={toggleAcount} className="authSwitch">{newAccount? "Log In" : "Create Account"}</button>
    </>
  );
}

export default AuthForm;