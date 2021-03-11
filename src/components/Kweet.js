import { dbService, storageService } from "fBase";
import React, { useState } from "react";

const Kweet = ({ postObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(postObj.text)

  const deleteClick = async () => {
    const approval = window.confirm("Are you sure you want to DELETE this Kweet?");
    if (approval) {
      await dbService.doc(`kweets/${postObj.id}`).delete();
      if (postObj.attachmentURL !== ""){
        await storageService.refFromURL(postObj.attachmentURL).delete();
      }
    } 
  }


  const toggleEditing = () => setEditing((prev) => !prev);


  const onSubmit = async (event) => {
    event.preventDefault();
    const approval = window.confirm("Are you sure you want to EDIT this Kweet?")
    if (approval) {
      await dbService.doc(`kweets/${postObj.id}`).update({
        text: newKweet
      })
      setEditing(false);
    }
  }


  const onChange = (event) => {
    const { target: { value } } = event;
    setNewKweet(value);
  }

  return (
    <div>
      {editing ? (
        <>
          {isOwner &&
            <>
              <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Edit your Kweet" value={newKweet} required />
                <input type="submit" value="Update Kweet" />
                <button onClick={toggleEditing}>Cancel</button>
              </form>
            </>
          }
        </>
      ) : (
        <>
        <div key={postObj.id}>
          <h4>{postObj.text}</h4>
          {postObj.attachmentURL && <img src={postObj.attachmentURL} width="50px" height="50px" />}
          {isOwner && (
            <>
              <button onClick={deleteClick}>Delete Kweet</button>
              <button onClick={toggleEditing}>Edit Kweet</button>
            </>
          )}
        </div>
        </>
      )}
    </div>
  );
}

export default Kweet;