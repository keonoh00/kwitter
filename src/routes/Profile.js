import { authService, dbService } from "fBase";
import React, { useEffect, useState } from "react";
import ProfilePost from "components/ProfilePost"
import Kweet from "components/Kweet";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myPost, setMyPost] = useState([]);

  useEffect(() => {
    dbService.collection("kweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const gotPost = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyPost(gotPost);
    });
  }, [])

  
  const signOut = () => {
    authService.signOut();
    window.confirm("Successfully Signed Out");
  }

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
      window.confirm("Username has Changed");
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
          maxLength={20}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{marginTop: 10}}
        />
      </form>
      <span className="profilePostTitle">My Posts</span>
      {myPost.map((post) => (
        <ProfilePost postObj={post} isOwner={post.creatorId === userObj.uid} />
      ))}
      <span className="formBtn cancelBtn logOut" onClick={signOut}>
        Sign Out
      </span>
    </div>
    )
  };
  
export default Profile;