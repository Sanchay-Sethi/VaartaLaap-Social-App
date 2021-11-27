import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./chatonline.css"
const ChatOnline = ({onlineUsers,currentId,SetCurrentChat}) => {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    useEffect(() => {
        const getFriends = async () => {
          const res = await axios.get("/users/friends/" + currentId);
          setFriends(res.data);
        };
    
        getFriends();
      }, [currentId]);
    
      useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
      }, [friends, onlineUsers]);

      const handleClick = async (user) => {
        try {
          const res = await axios.get(
            `/conversations/find/${currentId}/${user._id}`
          );
          SetCurrentChat(res.data);
        } catch (err) {
          console.log(err);
        }
      };

    return (
        <div className="chatOnline">
             {onlineFriends.map((o) => (
                <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
                    <div className="chatOnlineImgContainer">
                        <img className="chatOnlineImg" src={
                                o?.profilePicture
                                ? PF + o?.profilePicture
                                : PF + "person/avatard.png"
                            } alt="" />
                        <div className="chatOnlineBadge">
                        </div>
                    </div>
                    <span className="chatOnlineChat">{o?.username}</span>
                   
                    <Link className="chatOnlineVisitProfile" to={`/profile/${o?.username}`}  style = {{textDecoration: "none"}}>
                      Visit
                    </Link>


                </div>
            ))}
        </div>
    )
}

export default ChatOnline
