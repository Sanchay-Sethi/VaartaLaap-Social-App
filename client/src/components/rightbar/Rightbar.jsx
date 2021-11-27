import "./rightbar.css";
import { useContext, useEffect, useState,useRef } from "react";
import axios from "axios"
import Lottie from "react-lottie";
import nofriends from "../../assets/nofriend"
import offline from "../../assets/offline"
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {Add, Remove, Edit, Close} from "@material-ui/icons"
import ChatOnline from "../chatonline/ChatOnline";
import {io} from "socket.io-client"
import Modal from 'react-modal';

Modal.setAppElement('body');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function Rightbar({ user }) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    
  }

  function closeModal() {
    setIsOpen(false);
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: nofriends,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
};
const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: offline,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [friends, setFriends] = useState([])
  
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef()
  const [getUser, setGetUser] = useState(user)

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, []);
  
  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
        setOnlineUsers(
            currentUser.followings.filter((f)=>users.some(u=>u.userId===f))
          );
    });
  }, [currentUser]);

 
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
    window.location.reload()
  };

  

  const HomeRightbar = () => {
    return (
      <>
        <img className="rightbarAd" src={PF + "ad.png"} alt="" />
       
         <div className="chatOnline">
         {onlineUsers.length!==0 ? 
              <>
                <h3 style={{marginLeft : "20px", marginTop : "20px"}}>Online Friends</h3>
                  <div className="chatOnlineWrapper">
                      <ChatOnline onlineUsers={onlineUsers} currentId = {currentUser._id}/>      
                  </div>
    
                </>
                    : 
                    <div style = {{display : "flex", justifyContent : "center", alignItems : "center", flexDirection : "column"}}>
                    <h3>No friend is online</h3>              
                    <Lottie options={defaultOptions2} height= {200} width = {200}/>
                    </div>
          }
            </div>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
      {user.username !== currentUser.username && (
          !currentUser.followings.includes(user._id) ? 
          <button className = "FollowButton" onClick={handleClick} >
                      <Add/> Follow

          </button>
          :
          <button className = "unFollowButton" onClick={handleClick} >
          <Remove/> Unfollow        
          </button>
        )}

          
        <div id = "infomodal" style = {{borderRadius: "10px", borderBottom: "4px solid red",marginBottom: "20px", width: '94%', backgroundColor : "#fff", padding : "20px", display : "flex", flexDirection : "column",justifyContent : "flex-start", alignItems : "flex-start"}}>
            <h4 className="rightbarTitle"><span style={{textTransform: "capitalize"}}>{user._id !== currentUser._id ? "User" : "Your"}</span> Informations</h4>
            <div style = {{display: "flex", marginTop : "7px"}}>
              <span className="rightbarInfoKey">Current City:</span>
              <p>{user.city ? user.city : "Not Mentioned"}</p>
            </div>
            <div style = {{display: "flex", marginTop : "7px"}}>
              <span className="rightbarInfoKey">Home Town:</span>
              <p>{user.from ? user.from : "Not Mentioned"}</p>
            </div>
            <div style = {{display: "flex", marginTop : "7px"}}>
              <span className="rightbarInfoKey">Relationship:</span>
              <p>{user.relationship ? user.relationship  : "Not Mentioned"}</p>
            </div>
           {user.username === currentUser.username &&
           <>
            {/* <button className="rightbarFollowButton" onClick = {openModal}><Edit/>Edit Profile</button> */}
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <div style = {{position: "relative", width: "100%", display: "flex", flexDirection : "column"}}>
              <button onClick={closeModal} style = {{position : "absolute", top: "1px", right : "1px", backgroundColor : "transparent", border : "none", cursor : "pointer"}}><Close/></button>
              <h2 style={{fontSize: "40px", fontWeight: "900", margin : "30px 10px"}}>Edit Profile Information</h2>
              <form style = {{width: "100%", display: "flex", flexDirection : "column"}}>
                <input />
                <input />
                <input />
                <input />
                <button>tab navigation</button>
                <button>stays</button>
                <button>inside</button>
                <button>the modal</button>
              </form>
            </div>
          </Modal>
            </>
           }
          </div>
       
        
        <div className="rightbarFollowings">
          {friends.length === 0 ?
          <div style = {{ width: "100%",display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center"}}>
               <h3>No Friends Found!</h3>
               <Lottie options={defaultOptions} height= {250} width = {250}/>
               {user.username === currentUser.username &&
               <Link to = "/findfriends" style = {{color : "black"}}>
                <button style = {{padding : "5px 20px",fontSize : "20px", backgroundColor : "transparent", border : "2px solid black", color : "black", outline : "none", cursor : "pointer", marginBottom : "50px"}}>Find Friends</button>
               </Link>
                }
          </div>

            :
            <div style = {{display : "flex",flexDirection : "column"}}>
            <h3>Friends : </h3>
            <div style = {{display : "flex", flexWrap : "wrap"}}>
            {friends.map(friend=>(
              
              <Link to = {"/profile/"+friend.username} style = {{textDecoration : "none", color : "black"}}>
              <div className="rightbarFollowing"
               style = {{margin : "10px", display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center"}}>
              <img
                src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/avatard.png"}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          
            </Link>
            
          
          ))}
          </div>
          </div>
          }
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
