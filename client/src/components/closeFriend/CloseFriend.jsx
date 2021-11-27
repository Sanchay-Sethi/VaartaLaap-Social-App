import { Link } from "react-router-dom";
import "./closeFriend.css";

export default function CloseFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  return (
    <Link to={`/profile/${user.username}`} style = {{textDecoration: "none",color : "#000"}}>
     <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/avatard.png"} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
    </Link>
   
  );
}
