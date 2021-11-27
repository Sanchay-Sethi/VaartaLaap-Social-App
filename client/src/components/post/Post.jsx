import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

export default function Post({ post, socket, cuser }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentuser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentuser._id));
  }, [currentuser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      // console.log(res.data)
      // console.log(currentuser)
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);
  // console.log(socket)
  const likeHandler = (type) => {
    console.log(user._id)
    try {
      sendNotification(type)
      axios.put("/posts/" + post._id + "/like", { userId: currentuser._id });
      
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  const sendNotification = (type) => {
    console.log(cuser._id)
    console.log(user._id)
    socket?.emit("sendNotification",{
      senderId:cuser._id,
      receiverId:user?._id,
      type
    })
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose =  () => {
    setAnchorEl(null);
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete("/posts/"+post._id);
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  return (

    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
          <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/avatard.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {(currentuser._id === user._id) &&
            <MoreVert style = {{cursor: "pointer"}} aria-controls="basic-menu" aria-haspopup="true" onClick={handleClick} />
            }
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {
            post.img.includes("https://media.tenor.com/images/") ?  <img className="postImg" src={post?.img} alt="" /> : 
            <img className="postImg" src={PF + post?.img} alt="" />
          }
         
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={!isLiked?`${PF}unliked.png`:`${PF}liked.png`} onClick={()=>likeHandler(1)} alt="" />
            <span className="postLikeCounter">{like===0 ? null : like===1 ?  like+ " Friend liked it" : like+ " Friends liked it"} </span>
          </div>
          <div className="postBottomRight">
            {/* <span className="postCommentText">{post.comment} comments</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
