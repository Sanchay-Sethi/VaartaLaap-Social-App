import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import Topbar from "../../components/topbar/Topbar"
import "./messenger.css"
import sendIcon from "../../assets/send.png"
import ChatOnline from "../../components/chatonline/ChatOnline"
import Footer from "../../components/footer/Footer"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Lottie from "react-lottie";
import nochat from "../../assets/nochat"
import axios from "axios"
import {io} from "socket.io-client"
import offline from "../../assets/offline"
import { Link } from "react-router-dom"

const Messenger = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: nochat,
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
    const [conversations, SetConversations] = useState([])
    const [currentChat, SetCurrentChat] = useState(null)
    const [messages, SetMessages] = useState([])
    const [newMessage, SetNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [allUsers, SetAllUsers] = useState([])
    const [allUsersRecover, SetAllUsersRecover] = useState([])
    const socket = useRef()
    const scrollRef = useRef()
    const {user} = useContext(AuthContext)

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);

      useEffect(() => {
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          SetMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                user.followings.filter((f)=>users.some(u=>u.userId===f))
              );
        });
      }, [user]);

      useEffect(() => {
        const getConversations = async () => {
          try {
            const res = await axios.get("/conversations/" + user._id);
            SetConversations(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getConversations();
      }, [user._id, conversations]);


    useEffect(()=>{
        const getMessages = async () => {
            try {     
                const res = await axios.get("/messages/"+currentChat?._id)
                SetMessages(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMessages()
    },[currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
          };
      
          const receiverId = currentChat.members.find(
            (member) => member !== user._id
          );
      
          socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
          });
        try {
            const res = await axios.post("/messages",message)
            SetMessages([...messages, res.data])
            SetNewMessage("")
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages])

    useEffect(()=>{
        const getAllUsers = async () => {
            const res = await axios.get("/users/getall")
            let finalans = []
            user.followings.forEach(element => {
                const ans = res.data.filter((e)=>e._id===element)
                finalans.push(ans)
            });
            SetAllUsers(finalans)    
        }
        const checkConvers = async () => {
            const res = await axios.get("/conversations/" + user._id);
            if(res.data.length===0){
                getAllUsers()
            }else{
                const getFilteredUsers = async () => {
                    const res1 = await axios.get("/users/getall")
                    let finalans = []
                    user.followings.forEach(element => {
                        const ans = res1.data.filter((e)=>e._id===element)
                        finalans.push(ans)
                    });
                    // console.log(res.data)
                    res.data.forEach(element => {
                        SetAllUsers(finalans.filter((e)=>e[0]._id!==element.members[1]))
                    });
                }
                getFilteredUsers()
            }
        }
        checkConvers()
    },[])

    const handlechat = async (receiverId) => {
        const getconv = {
            senderId : user._id,
            receiverId
        }
        try {
            const res = await axios.post("/conversations/",getconv)
            SetAllUsers(allUsers.filter((e)=>e[0]._id!==res.data.members[1])) 
            SetCurrentChat(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <>
        <Topbar/>
        <div className = "messenger">
            <div className="chatMenu" style={{padding : "10px"}}>
                    <input  type="text" placeholder="Search and chat with friend" className="chatMenuInput"/>
                    <div className="chatMenuWrapper">
                        {conversations.length!==0 &&  <h4 style = {{color : "white", marginTop : "10px"}}>Recent Conversations</h4>}
                       
                        {conversations.map((c)=>(
                            <div onClick={()=>SetCurrentChat(c)}>
                                <Conversation conversation = {c} currentUser = {user}/>
                            </div>
                        ))} 
                        {allUsers.length!==0 ? 
                        <h4 style = {{color : "white", marginTop : "10px"}}>Start First Conversation</h4>
                        :
                        <div style = {{display : "flex", justifyContent : "center", alignItems : "center", flexDirection : "column", marginTop : "20px"}}>
                        
                        <h3 style = {{color : "#fff"}}>Make Some Friends</h3>     
                        <Link to = "/findfriends" style = {{textDecoration : "none"}}>
                            <button style = {{backgroundColor : "red", color : "white", border : "none",padding : "10px 20px", borderRadius : "10px", marginTop : "20px", cursor : "pointer"}}>Find Friends</button>
                        </Link>         

                        </div>
                        }
                        
                        {allUsers.map((c)=>(
                            c.map((y)=>(
                                <div>
                                <div className="conversation" onClick = {()=>handlechat(y._id)}>
                                    <img className="conversationImg" src={y?.profilePicture ? PF + y?.profilePicture : PF + "person/avatard.png"} alt="" />
                                    <span className="conversationName">{y?.username}</span>
                                </div>
                                </div>
                            ))
                        ))}   
                    </div>
                    
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {/* <h3>Let's have some वार्ताlaap...</h3> */}
                    {
                        currentChat ? (
                            <>
                    <div className="chatBoxTop">
                        
                        {messages.map(m=>(
                            <div ref = {scrollRef}>
                                <Message  message={m} own = {m.sender === user._id}/>
                            </div>
                        ))}
                    </div> 
                    <div className="chatBoxBottom">
                        <input onChange={(e)=>SetNewMessage(e.target.value)} value={newMessage} className="chatMessageInput" type="text" placeholder = "💬 Process Your वार्ताlaap ..." />
                        {newMessage!=="" &&
                        <button className="chatSubmitButton" onClick={handleSubmit}>&nbsp;<img style = {{width: "20px", objectFit : "center"}} src= {sendIcon}/>Send</button>
                        }
                    </div>
                      </>
                     ) : (
                        <div className="noConversationText">
                            <Lottie options={defaultOptions} height= {250} width = {250}/>
                            <h4>
                                Get some friends to have a beautiful chat!!
                            </h4>
                        </div>
                      )}
                </div>
            </div>
            <div className="chatOnline">
                
                {onlineUsers.length!==0 ? 
                    <>
                        <h3 style={{marginLeft : "20px", marginTop : "20px"}}>Online Friends</h3>
                        <div className="chatOnlineWrapper">
                            <ChatOnline onlineUsers={onlineUsers} currentId = {user._id} SetCurrentChat = {SetCurrentChat} />                        
                        </div>
            
                        </>
                            : 
                            <div style = {{display : "flex", justifyContent : "center", alignItems : "center", flexDirection : "column", marginTop : "20px"}}>
                            <h3>No friend is online</h3>              
                            <Lottie options={defaultOptions2} height= {200} width = {200}/>
                            </div>
                }
                
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Messenger
