import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";
import {Add, Chat, Search, Clear, Remove} from "@material-ui/icons"
import "./friends.css"
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import nofriends from "../../assets/nofriend"


const Friends = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: nofriends,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };
   
    const [noUser, SetNoUser] = useState(false)
    const [allUsers, SetAllUsers] = useState([])
    const [allUsersRecover, SetAllUsersRecover] = useState([])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user:currentUser, dispatch} = useContext(AuthContext)
    const [searching, SetSearching] = useState("")

    const [follow, setFollow] = useState(false)
    useEffect(()=>{
        const getAllUsers = async () => {
            const getUsers = await axios.get("/users/getall")
            SetAllUsers(getUsers.data)
            SetAllUsersRecover(getUsers.data)
        }
        getAllUsers()
    },[])
    useEffect(()=>{
        const results = allUsers.filter((x)=>{
            return x.username.toLowerCase().includes(searching.toLocaleLowerCase())
        })
        if(results.length===0){SetNoUser(true)}
        SetAllUsers(results)
        if(searching === ""){
            SetAllUsers(allUsersRecover)
            SetNoUser(false)
        }
    },[searching])

    const handleFollow = async (userid) => {
        try {
            if(currentUser.followings.includes(userid)){
                await axios.put(`/users/${userid}/unfollow`, {
                    userId: currentUser._id,
                  });
                  dispatch({ type: "UNFOLLOW", payload: userid });

            }else{
                await axios.put(`/users/${userid}/follow`, {
                    userId: currentUser._id,
                  });
                  dispatch({ type: "FOLLOW", payload: userid });
            }
            window.location.reload()
            
        } catch (error) {
            console.log(error)
        }
       
    }


    return (
        <>
          <Topbar />
          <div className="homeContainer">
            <Sidebar />
                <div style={{
                     flex:"5.5"
                     ,color : "white"
                }}>
                    <div style={{
                         backgroundColor: "#161740",
                         padding: "20px"
                     }}
                    >
                        <h1 style = {{fontSize : "30px", fontWeight : "900", marginBottom : "10px"}}>Make Some Friends!</h1>
                        <p>Find your friend, just type name here...</p>
                        <div className="topbarCenter">
                            <div className="searchbar" style={{marginBottom:  "60px", marginTop: "20px", position: " relative"}}>
                                <Search className="searchIcon"style = {{color : "black"}} />
                                <input
                                    placeholder="Find Your Friend..."
                                    className="searchInput"
                                    value = {searching}
                                    onChange = {e=>SetSearching(e.target.value)}
                                />
                                {searching!=="" ? <Clear onClick={()=>SetSearching("")} style = {{color : "black", position : "absolute", right : "10px", cursor : "pointer"}}/> : null}
                                
                            </div>
                        </div>
                        {
                            noUser ? <div style = {{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%"}}>
                                 <Lottie options={defaultOptions} height= {250} width = {250}/>
                                 <h2>Sorry! No Friend Found...</h2>
                                 <p>Try With Different User Name</p>
                            </div> :
                            allUsers.map(user=>{
                                return(    
                                    <div style={user._id!==currentUser._id ? {color : "#000",flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: "10px", borderRadius: "15px", margin: "10px", borderBottom: "3px solid red"} : {display : "none"}}>
                                         <Link to={`/profile/${user.username}`} style = {{textDecoration: "none",color : "#000"}}>
                                            <div style = {{display : "flex"}}>
                                            <img style = {{
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }} src={
                                                user.profilePicture!==""
                                                ? PF + user.profilePicture
                                                : PF + "person/avatard.png"
                                            }></img>

                                            <div style = {{display: "flex", flexDirection: "column", marginLeft: "20px"}}>
                                                <h3 style = {{textTransform: "capitalize", marginBottom : "10px"}}>{user.username}</h3>
                                                <p style = {{textTransform: "capitalize"}}>{user.desc}</p>
                                            </div> 
                                            </div>
                                        </Link>
                                        <div style = {{display: "flex", alignSelf : "right"}}>
                                        {!currentUser.followings.includes(user._id) ? 
                                        <button className = "FollowButton" onClick={()=>handleFollow(user._id)} >
                                                    <Add/> Follow
                      
                                        </button>
                                        :
                                        <button className = "unFollowButton" onClick={()=>handleFollow(user._id)} >
                                        <Remove/> Unfollow        
                                        </button>
                                        }
                                        <Link to = "/messenger" style = {{textDecoration : "none"}}>
                                        <button className = "ChatButton" >
                                            <Chat/>&nbsp; Chat
                                        </button>
                                        </Link>
                                        </div>   
                                    </div>
                                    
                                )
                            })
                        }
                    </div>
                </div>
            <Rightbar/>
          </div>
        </>
      );
}

export default Friends
