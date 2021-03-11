import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="nweet">
      {editing ? (
        <>
          {isOwner &&
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input onChange={onChange} type="text" placeholder="Edit your Kweet" value={newKweet} required autoFocus className="formInput" />
                <input type="submit" value="Update Kweet" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
            </>
          }
        </>
      ) : (
        <>
        <div key={postObj.id}>
          <h4>{postObj.text}</h4>
          {postObj.attachmentURL && <img src={postObj.attachmentURL} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={deleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
          </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}

export default Kweet;