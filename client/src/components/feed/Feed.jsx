import Post from "../post/Post";
import Share from "../share/Share";
import { useContext, useEffect, useState } from "react";
import "./feed.css";
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";



export default function Feed({username, socket, cuser}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [post, setPost] = useState([])
  const {user} = useContext(AuthContext)
  const [city, setCity] = useState("")
  const [from, setFrom] = useState("")
  const [relationShip, setRelationship] = useState(0)
   useEffect(()=>{
    const fetchPosts = async () => {
      const res = username ? 
      await axios.get("/posts/profile/"+username) 
      : await axios.get("posts/timeline/" + user._id)
      setPost(res.data.sort((p1,p2)=>{
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      }))
    }
    fetchPosts()
  },[username, user._id])
  return (
    <>
      <div className="feed">
        <div className="feedWrapper">
        
          

       
        {(!username || username === user.username) && <Share />}


          {
            post.length===0 ?
              <div style = {{display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center"}}>
              <img src = {`${PF}pagelost.png`} style = {{width : "350px", height : "300px"}}/> 
              <h1 style = {{color : "#fff"}}>No Post Found !</h1>
              
              </div> : 
                  <>
                  
                  {post.map((p)=>(
                    <Post key = {p._id} post = {p} socket = {socket} cuser = {cuser}/>
                  ))
                  }
                  </>
          }  
        </div>
      </div>
    </>
  );
}

{/* <h4 className="rightbarTitle"><span style={{textTransform: "capitalize"}}>{user.username !== currentUser.username ? user.username : "Your"}</span> Informations</h4>
<div className="rightbarInfo" >
  <div className="rightbarInfoItem" >
    <span className="rightbarInfoKey">City:</span>
    {currentUser._id===user._id ?
      <>
         <input type = "text" value = {city} onChange={(e)=>setCity(e.target.value)} placeholder = {user.city ? user.city : "Specify Current City 🖊️"} style = {{
          backgroundColor : "transparent",
          fontSize : "15px", textAlign : "center", border : "0px", outline : "none", 
        }} />
        
    </> :
    <span className="rightbarInfoValue">{user.city || "Not Mentioned"}</span>
    }
  </div>
  <div className="rightbarInfoItem" style = {{width: "100%"}}>
    <span className="rightbarInfoKey">Home Town:</span>
    {currentUser._id===user._id ?
      <>
         <input type = "text" value = {from} onChange={(e)=>setFrom(e.target.value)} placeholder = {user.from ? user.from : "Specify Home Town"} style = {{
          backgroundColor : "transparent",
          fontSize : "15px", textAlign : "center", border : "0px", borderBottom : "1px solid black", outline : "none", 
        }} />
        
    </> :
    <span className="rightbarInfoValue">{user.from || "Not Mentioned"}</span>
    }
    
  </div>
  <div className="rightbarInfoItem" style = {{width: "100%"}}>
    <span className="rightbarInfoKey">Relationship:</span>
    {currentUser._id===user._id ?
      <>
         <input type = "text" value = {relationShip===0 ? "" : relationShip} onChange={(e)=>setRelationship(e.target.value)} placeholder = {user.relationShip ? user.relationShip : "Type only 1 for Single/ 2 for being Taken" } style = {{
          backgroundColor : "transparent",width: "80%",
          fontSize : "15px", textAlign : "center", border : "0px", borderBottom : "1px solid black", outline : "none", 
        }} />
        
    </> :
    <span className="rightbarInfoValue">{user.relationship === 1 ? "Single"  : user.relationship === 2 ? "Married" : "Not Mentioned"}</span>
    }

    {currentUser._id===user._id
      && (city!=="" || from!=="" || relationShip!==0) &&
        <button style = {{backgroundColor : "transparent", border : "2px solid black", padding : "5px", cursor : "pointer"}}>Update Info</button>
   
      
    }
    
  </div>
</div> */}
