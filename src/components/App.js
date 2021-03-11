import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase"

function App() {
  const [init, setInit] = useState(false);
  const [ userObj, setUserObj ]= useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        // Making currentUser object concise
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }
      setInit(true);
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Loading..."}
      <footer>&copy; {new Date().getFullYear()} Kwitter</footer>
    </>
  );
}

export default App;
