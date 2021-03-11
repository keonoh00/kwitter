import { authService, dbService } from "fBase";
import React, { useEffect, useState } from "react";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const signOut = () => {
    authService.signOut();
    window.confirm("Successfully Signed Out");
    window.location.replace("/");
  }
  
  const getMyKweets = async() => {
    const kweets = await dbService
      .collection("kweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "asc")
      .get();
    console.log(kweets.docs.map((doc) => doc.data()));
  }
  
  useEffect(() => {
    getMyKweets();
  }, [])

  const onChange = (event) => {
    const { target : { value } } = event;
    setNewDisplayName(value);
  }
  
  const onSubmit = async(event) => {
    event.preventDefault()
    if (userObj.displayName !== newDisplayName && newDisplayName != "") {
      await userObj.updateProfile({
        displayName: newDisplayName
      });
      refreshUser();
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Username" value={newDisplayName} />
        <input type="submit" value="Change Name" />
      </form>
      <button onClick={signOut}>Sign Out</button>
    </>
    )
  };
  
export default Profile;