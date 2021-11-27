import "./share.css";
import {PermMedia, Label,Room, EmojiEmotions, Cancel, Gif} from "@material-ui/icons"
import { useContext, useRef, useState } from "react";
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import Picker from 'emoji-picker-react';
import GifPicker from 'gifpicker';
import 'gifpicker/dist/style.css';

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [descc, setDescc] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openGif, setOpenGif] = useState(false);
  const [getGif, setGetGif] = useState("")

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    console.log(chosenEmoji)
    if(chosenEmoji!==null){
      setDescc(descc + chosenEmoji.emoji)
    }
    setOpenEmoji(false)
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    if(getGif!==""){
      newPost.img = getGif;
    }

    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {}
  }

  
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/avatard.png"} alt="" />

          <input
            placeholder={"Express Your Thoughts Here " + user.username.toUpperCase()}
            className="shareInput" ref = {desc} onChange={(e)=>setDescc(e.target.value)} value={descc}
          />
        </div>
        <hr className="shareHr"/>
        
        {file &&(
          <div className="shareImgContainer">
            <img className="shareImg" src = {URL.createObjectURL(file)}/>
            <Cancel className = "shareCancelImg" onClick = {()=>setFile(null)}/>
          </div>
        )}

        {
          
          openEmoji && 
          <div className="shareImgContainer">
            <Picker  onEmojiClick={onEmojiClick} /> 
            <Cancel className = "shareCancelImg" onClick = {()=>{setChosenEmoji(null);setOpenEmoji(false)}}/>
          </div>
        }
        {
          openGif && 
            <div className="shareImgContainer">
              <GifPicker  apikey="OLHI4860QCOX" onSelect={gifUrl => setGetGif(gifUrl)} />
              <Cancel className = "shareCancelImg" onClick = {()=>{setGetGif("");setOpenGif(false)}}/>
            </div>
          

        }
        
        <form className="shareBottom" onSubmit = {handleSubmit}>
            <div className="shareOptions">
            {!getGif && 
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo Post</span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            }

              <div className="shareOption" onClick = {()=>{setOpenEmoji(true); setOpenGif(false)}}>
                    <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                    <span className="shareOptionText">Add Emotions</span>
                </div>
                {
                  file ? 
                  null : 
                  <div className="shareOption" onClick = {()=>{setOpenGif(true); setOpenEmoji(false);}}>
                    <Gif htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Add Gif</span>
                </div>
                }
               
            
                
            </div>
            
            {descc!=="" &&
             <button className="shareButton" type = "submit">Share</button>
            }

        </form>
      </div>
    </div>
  );
}
