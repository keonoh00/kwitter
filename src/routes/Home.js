import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import Kweet from "components/Kweet"
import KweetFactory from "components/kweetFactory";


const Home = ({ userObj }) => {
  
  const [posts, setPosts] = useState([]);
  
  
  useEffect(() => {
    dbService.collection("kweets").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const dbPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(dbPosts);
    })
  }, []);
  
  return (
    <div className="container">
      <KweetFactory userObj={userObj} />
      <div style={{marginTop:20}}>
        {posts.map((post) => (
          <Kweet
            key={post.id}
            postObj={post}
            userObj={userObj}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
};

export default Home;
