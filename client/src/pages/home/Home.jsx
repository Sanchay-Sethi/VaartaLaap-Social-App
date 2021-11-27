import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"
import {io} from "socket.io-client"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function Home() {
  const {user} = useContext(AuthContext)
  const [socket, setSocket] = useState(null)
  useEffect(()=>{
    setSocket(io("ws://localhost:8900"))
  },[])

  useEffect(()=>{
    socket?.emit("addUser", user._id);
    console.log(socket)
  },[socket, user])
  return (
    <>
      <Topbar socket = {socket} />
      <div className="homeContainer">
        <Sidebar />
        <Feed socket = {socket} cuser = {user}/> 
        <Rightbar/>
      </div>
    </>
  );
}
