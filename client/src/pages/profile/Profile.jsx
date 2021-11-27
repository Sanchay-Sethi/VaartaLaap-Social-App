import "./profile.css";
import { useState, useEffect, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import {useParams} from "react-router"
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/loading/Loading";
import {Add, Remove, Edit, Close} from "@material-ui/icons"
import {
  CameraAlt
} from "@material-ui/icons";
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

export default function Profile() {
  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [user, setUser] = useState({})
  const username = useParams().username
  const [loading, setLoading] = useState(false)
  const [pp, setPP] = useState(null);
  const [cp, setCP] = useState(null);
  const [bio, setBio] = useState("");

  const [city, setCity] = useState("")
  const [from, setFrom] = useState("")
  const [relationShip, setRelationship] = useState("")

  const { user : currentUser, dispatch} = useContext(AuthContext);

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    
  }

  const closeModal = () => {
    setCity("")
    setFrom("")
    setRelationship("")
    setIsOpen(false);
  }

  useEffect(()=>{
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`)
      if(currentUser._id===res.data._id){
        // localStorage.setItem('user', JSON.stringify(res.data));
        dispatch({ type: "UPDATEUSER", payload: res.data });
      }
      setUser(res.data)
    }
    fetchUser()
    
  },[username]);

  const handleProfilePicture = async (e) => {
    e.preventDefault()
    setLoading(true)
    const profile = {
      userId : currentUser._id,
      profilePicture : ""
    }
    const data = new FormData();
    const fileName = Date.now() + pp.name;
    data.append("name", fileName);
    data.append("file", pp);
    profile.profilePicture = fileName;
    try {
      await axios.post("/upload", data);
    } catch (err) {}

    try {
      await axios.put("/users/"+currentUser._id,profile)
      setPP(null)
      setLoading(false)
    } catch (error) {
      setPP(null)
      setLoading(false)
      console.log(error)
    }
      
    window.location.reload()

  }
  const handleCoverPicture =async  (e)=>{
    e.preventDefault()
    setLoading(true)
    const profile = {
      userId : currentUser._id,
      coverPicture : ""
    }
    const data = new FormData();
    const fileName = Date.now() + cp.name;
    data.append("name", fileName);
    data.append("file", cp);
    profile.coverPicture = fileName;
    try {
      await axios.post("/upload", data);
    } catch (err) {}

    try {
      await axios.put("/users/"+currentUser._id,profile)
      setCP(null)
      setLoading(false)
    } catch (error) {
      setCP(null)
      setLoading(false)
      console.log(error)
    }
      
    window.location.reload()
  }

  const handleBio = async(e)=>{
    e.preventDefault()
    setLoading(true)
    const profile = {
      userId : currentUser._id,
      desc : bio
    }

    try {
      await axios.put("/users/"+currentUser._id,profile)
      setBio("")
      setLoading(false)
    } catch (error) {
      setBio("")
      setLoading(false)
      console.log(error)
    }
      
    window.location.reload()
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const profile = {
      userId : currentUser._id
    }
    if(city!==""){
      profile.city = city
    }
    if(from!==""){
      profile.from = from
    }
    if(relationShip!==""){
      profile.relationship = relationShip
    }
    console.log(profile)
    try {
      const res = await axios.put("/users/"+currentUser._id,profile)
      closeModal()
      setLoading(false)
    } catch (error) { 
      closeModal()
      setLoading(false)
      console.log(error)
    }
    window.location.reload()

  }

  return (
    <>
    {
      loading ? <Loading/> : 
   <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
            {currentUser._id!==user._id ? <img
                className="profileCoverImg"
                style = {{position : "relative", borderBottomRightRadius : "70px", borderBottom : "5px solid black", boxShadow : "5px 4px 0px red"}}
                src={ user.coverPicture ? PF + user.coverPicture : PF + "person/cover.png"}
                alt=""
              /> : 
            <label htmlFor="cp" style={{cursor : "pointer"}}>
              <img
                style = {{position : "relative", borderBottomRightRadius : "70px", borderBottom : "5px solid black", boxShadow : "5px 4px 0px red"}}
                className="profileCoverImg"
                src={cp ? URL.createObjectURL(cp) : user.coverPicture ? PF + user.coverPicture : PF + "person/cover.png"}
                alt=""
              />
              <CameraAlt style = {{position : "absolute", top : "15px", right : "15px"}}/>
              <input
                  style={{ display: "none" }}
                  type="file"
                  id="cp"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setCP(e.target.files[0])}
                />
              </label>
              }
              {currentUser._id!==user._id ?  <img 
                className="profileUserImg"
                src={user.profilePicture ? PF +user.profilePicture :  PF + "person/avatard.png"}
                alt=""
              /> : 
              <label htmlFor="pp" style={{cursor : "pointer"}}>
              {cp &&
              <div style={{position : "relative", width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", margin : "10px 0px"}}>
                <button onClick = {handleCoverPicture} style = {{position : "absolute",right : "30px",backgroundColor : "#000", border : "2px solid black", padding : "5px", cursor : "pointer", color : "#fff"}}>Click To Update</button>
              </div>
              }
              <img 
                className="profileUserImg"
                src={pp ? URL.createObjectURL(pp) : user.profilePicture ? PF +user.profilePicture :  PF + "person/avatard.png"}
                alt=""
              />
              <input
                  style={{ display: "none" }}
                  type="file"
                  id="pp"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setPP(e.target.files[0])}
                />
                </label>
              }
            </div>
            
            {pp &&
            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin : "10px 0px"}}>
              <button onClick = {handleProfilePicture} style = {{backgroundColor : "transparent", border : "2px solid black", padding : "5px", cursor : "pointer"}}>Click To Update</button>
            </div>
            }
            <div className="profileInfo">
                <h4 className="profileInfoName" style={{textTransform: "capitalize"}}>{user.username}</h4>
               
                {currentUser._id===user._id ?
                <>
                 <input type = "text" value = {bio} onChange={(e)=>setBio(e.target.value)} placeholder = {user?.desc? user.desc : "Type Your Bio 🖊️"} style = {{
                  margin : "10px 0px",
                  fontSize : "17px", textAlign : "center", border : "0px", borderBottom : "1px solid black", outline : "none", padding : "5px"
                }} />
                {bio!=="" &&
                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin : "10px 0px"}}>
                  <button onClick = {handleBio} style = {{backgroundColor : "transparent", border : "2px solid black", padding : "5px", cursor : "pointer"}}>Update Bio</button>
                </div>
                }
                </>
                 :  <span className="profileInfoDesc" style={{textTransform: "capitalize"}}>{user.desc ? user.desc : "Bio Not Mentioned"}</span>

                }  
            </div>
            {user.username === currentUser.username &&
           <>
            <button className="rightbarFollowButton" onClick = {openModal} style = {{position: "absolute", right : "50px"}}><Edit/>Edit Info</button>
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <div style = {{position: "relative", width: "100%", display: "flex", flexDirection : "column"}}>
              <button onClick={closeModal} style = {{position : "absolute", top: "1px", right : "1px", backgroundColor : "transparent", border : "none", cursor : "pointer"}}><Close/></button>
              <h2 style={{fontSize: "40px", fontWeight: "900", margin : "30px 10px"}}>Edit Information</h2>
              <div  style = {{width: "100%", display: "flex", flexDirection : "column"}}>
                <input onChange = {(e)=>setCity(e.target.value)} placeholder = {currentUser.city ? currentUser.city : "Type current City"} style = {{ height : "25px", backgroundColor : "transparent", border : "2px solid black", borderBottom : "4px solid black", borderRadius : "10px", padding : "5px", fontSize : "18px", marginTop : "8px"}}/>
                <input onChange = {(e)=>setFrom(e.target.value)} placeholder = {currentUser.from ? currentUser.from : "Type Home Town"} style = {{height : "25px", backgroundColor : "transparent", border : "2px solid black", borderBottom : "4px solid black", borderRadius : "10px", padding : "5px", fontSize : "18px", marginTop : "8px"}}/>
                <select value = {relationShip} onChange = {(e)=>setRelationship(e.target.value)} style = {{backgroundColor : "transparent", border : "2px solid black", borderBottom : "4px solid black", borderRadius : "10px", padding : "5px", fontSize : "18px", marginTop : "8px"}}>
                  <option value="" selected disabled hidden>Set Relationship</option>
                  <option>Single</option>
                  <option>Taken</option>
                  <option>Married</option>
                </select>
               {city!=="" || from !== "" || relationShip !== "" ?  
               <button onClick={handleEdit} className="rightbarFollowButton" style = {{display : "flex", justifyContent : "center", alignItems : "center"}}>Update</button> : null
                }
              </div>
            </div>
          </Modal>
            </>
           }
          </div>
          <div className="profileRightBottom">
            <Feed username = {username}/>
            <Rightbar user = {user}/>
          </div>
        </div>
      </div>
      </>
       }
    </>
  );
}
