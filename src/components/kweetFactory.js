import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fBase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const KweetFactory = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async(event) => {
    event.preventDefault();
    if (kweet === "") {
      return;
    }
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }
    const nowTime = new Date(Date.now());
    const year = nowTime.getFullYear();
    const month = nowTime.getMonth() + 1;
    const date = nowTime.getDate();
    const hour = nowTime.getHours();
    const minute = nowTime.getMinutes();
    const time = `${year}/${month}/${date} ${hour}:${minute}`;
    const kweetObj = {
      text: kweet,
      createdAt: Date.now(),
      date: time,
      creatorId: userObj.uid,
      userName: userObj.displayName,
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

  /* ----------------------RETURN---------------------- */
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input className="factoryInput__input"
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={kweet}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
      </div>
      <label>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
        <input id="attach-file"
          onChange={onFileChange}
          type="file"
          accept="image/*"
          style={{opacity:0,}}
        />
      {attachment && 
        (
          <div className="factoryForm__attachment">
            <img alt="" src={attachment} style={{ backgroundImage: attachment }} />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )
      }
    </form>
  );
}

export default KweetFactory;