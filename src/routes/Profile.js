import { authService, dbService } from "fBase";
import React, { useEffect, useState } from "react";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const signOut = () => {
    authService.signOut();
    window.confirm("Successfully Signed Out");
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
    if (userObj.displayName !== newDisplayName && newDisplayName !== "") {
      await userObj.updateProfile({
        displayName: newDisplayName
      });
      window.confirm("User Name has Changed");
      refreshUser();
    }
  }

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Type Name"
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{marginTop: 10}}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={signOut}>
        Sign Out
      </span>
    </div>
    )
  };
  
export default Profile;