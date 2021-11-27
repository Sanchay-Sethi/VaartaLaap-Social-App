import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  VerifiedUser,
  ChildFriendlyRounded,
  NotificationImportant,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState,useEffect } from "react";
import axios from "axios"

export default function Sidebar() {
  const {user} = useContext(AuthContext)
  const [friends, setFriends] = useState([])
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
  },[]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link to = "/findfriends" style = {{textDecoration: "none", color: "#000"}}> 
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Find Friends</span>
          </li>
          </Link>
          <Link to = "/messenger" style = {{textDecoration: "none", color: "#000"}}> 
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          </Link>
          <Link to = {`/profile/${user.username}`} style = {{textDecoration: "none", color: "#000"}}>
            <li className="sidebarListItem">
            <VerifiedUser className="sidebarIcon" />
              <span className="sidebarListItemText">Profile</span>
            </li>
          </Link>
          

        </ul>
        <hr className="sidebarHr" />
        <p>Friends</p><br/>
        {friends.length===0 ? 
        <div style = {{display : "flex", justifyContent : "center", alignItems : "center", flexDirection : "column", marginTop : "20px"}}>
                        
        <h3>Make Some Friends</h3>     
        <Link to = "/findfriends" style = {{textDecoration : "none"}}>
            <button style = {{backgroundColor : "black", color : "white", border : "none", padding : "10px 20px", borderRadius : "10px", marginTop : "20px", cursor : "pointer"}}>Find Friends</button>
        </Link>         

        </div> : 
        <ul className="sidebarFriendList">
          {friends.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
        }
      </div>
    </div>
  );
}
