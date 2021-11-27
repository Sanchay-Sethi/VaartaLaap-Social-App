import "./topbar.css";
import { Search, Person, Chat, Notifications, ExitToApp } from "@material-ui/icons";
import {Link} from "react-router-dom"
import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"

export default function Topbar({socket}) {
  const {user} = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);
  console.log(notifications)

  return (
    <>
    <div className="topbarContainer">
      <div className="topbarLeft">
      <a href = "/" style ={{textDecoration: "none"}}>
        <span className="logo">वार्ताlaap</span>
      </a>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search Folks, Chit-Chats"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
        </div>
        <Link to = {`/profile/${user.username}`} style = {{display : "flex", alignItems : "center", textDecoration : "none", color : "white"}} >
        <span style = {{fontSize : "16px", fontWeight : "300", marginRight : "10px", textTransform : "capitalize"}}>{user.username}</span>
        <img src={user.profilePicture ? PF + user.profilePicture : PF + "person/avatard.png" } alt="" className="topbarImg"/>
        </Link>
        <div style = {{display : "flex", justifyContent : "center", alignItems : "center", cursor : "pointer"}} onClick={()=>{
          localStorage.removeItem("user");
          window.location.reload();
        }}>
          <p> <ExitToApp /></p>
          <p> Logout</p>
        </div>
      </div>
    </div>
    <div className="mobile_search">
        <div className="searchbar2">
          <Search className="searchIcon" />
          <input
            placeholder="Search Folks, Chit-Chats"
            className="searchInput"
          />
        </div>
      </div>
    </>
  );
}
