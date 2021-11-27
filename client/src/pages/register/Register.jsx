import "./register.css";
import { useRef, useState } from "react";
import axios from "axios"
import {useHistory} from "react-router"
import {Link} from "react-router-dom"
import Loading from "../../components/loading/Loading";
import Lottie from "react-lottie";

import wave2 from "../../assets/wave2.json"


export default function Register() {
  
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: wave2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
};
  const username = useRef()
  const email = useRef()
  const city = useRef()
  const password = useRef()
  const confirmPassword = useRef()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(confirmPassword.current.value !== password.current.value){
      password.current.setCustomValidity("Passwords are not macthing")
    }else{
      setLoading(true)
      const user = {
        username : username.current.value,
        email : email.current.value,
        city : city.current.value,
        password : password.current.value,
        profilePicture : ""
      }
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        user.profilePicture = fileName;

        try {
          await axios.post("/upload", data);
        } catch (err) {}
        
      }
      try{
        await axios.post("/auth/register", user);
        setLoading(false)
        history.push("/login")
      }catch(err){
        setLoading(false)
        console.log(err);
      }
    }
  }
  return (
    <>
    {loading ? <Loading/> : 
    
    <div className="registers">
     
      <Lottie className="rotateLottie" style={{position: "absolute", bottom: "0", left: "0", opacity: "50%", zIndex: "-2"}} options={defaultOptions2} height= {700} width = {1200} />

      <div className="registerWrappers">
        <div className="registerLefts">
          <h4 style = {{marginBottom : "30px", fontSize : "40px", fontWeight : "800"}}>Welcome To</h4>
          <h3 className="registerLogos">वार्ताLaap</h3>
          <p style = {{marginTop : "40px", fontSize : "25px", fontWeight : "300"}}>
            Make new friends here worldwide and start your first conversation easily...
          </p>
        </div>
        <div className="registerRights">
          <form className="registerBoxs" onSubmit = {handleSubmit}>
          <label htmlFor="file" className="shareOptions" style = {{display : "flex",justifyContent : "center",alignItems : "center", flexDirection : "column", cursor : "pointer"}}>
                <p style = {{fontWeight : "700"}}>Set Profile Picture</p>
                <img src = {file ? URL.createObjectURL(file) : PF + "person/avatard.png"} style = {{width : "100px", height : "100px", objectFit : "center", borderRadius : "50%"}}/>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
            </label>
            <input type = "text" placeholder="Set Username" required ref = {username} className="registerInputs" />
            <input type = "email" placeholder="Enter Email" required ref = {email} className="registerInputs" />
            <input type = "text" placeholder="Current City" required ref = {city} className="registerInputs" />
            <input type = "password" placeholder="Password" required ref = {password} className="registerInputs"  minLength = "6"/>
            <input type = "password" placeholder="Confirm Password" required ref = {confirmPassword} className="registerInputs" minlength = "6"/>
            <button className="registerButtons">Sign Up</button>
            <Link to = "/login" className="registerRegisterButtons">
              Already Registered ? LOGIN
            </Link>
          </form>
        </div>
      </div>
    </div>
    }
    </>
  );
}
