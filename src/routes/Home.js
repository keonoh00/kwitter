import { dbService, storageService } from "fBase";
import React, { useEffect, useState } from "react";
import Kweet from "components/Kweet"
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [posts, setPosts] = useState([]);
  const [attachment, setAttachment] = useState("");
  
  useEffect(() => {
    dbService.collection("kweets").onSnapshot((snapshot) => {
      const dbPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(dbPosts);
    })
  }, []);
  
  const onSubmit = async(event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }
    const kweetObj = {
      text: kweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    }
    await dbService.collection("kweets").add(kweetObj);
    setKweet("");
    setAttachment("");
  };
  
  const onChange = (event) => {
    const { target : { value }} = event;
    setKweet(value);
  }
  
  const onFileChange = (event) => {
    const { target : { files } } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget : { result } } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(file);
  }
  
  const onClearAttachment = () => {
    setAttachment("");
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} value={kweet} />
        <input onChange={onFileChange} type="file" accept="image/*" />
        {attachment && <img src={attachment} width="50px" height="50px" />}
        <button onClick={onClearAttachment}>Clear Image</button>
        <input type="submit" value="Send" />
      </form>
      <div>
        {posts.map((post) => (
          <Kweet
            key={post.id}
            postObj={post}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
};

export default Home;
