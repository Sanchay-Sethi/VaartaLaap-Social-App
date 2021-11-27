import { useContext, useRef } from "react";
import "./login.css";
import {loginCall} from "../../apiCalls"
import { AuthContext } from "../../context/AuthContext";
import {CircularProgress} from "@material-ui/core"
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import avatar from "../../assets/avatar.json"

export default function Login() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: avatar,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
};
  const email = useRef()
  const password = useRef()
  const {isFetching, dispatch} = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall({email : email.current.value, password : password.current.value}, dispatch);
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h4 style = {{marginBottom : "30px", fontSize : "30px", fontWeight : "900"}}>Login To</h4>
          <h3 className="loginLogo">वार्ताLaap</h3>
          <span className="loginDesc" style = {{marginTop : "40px", fontSize : "25px", fontWeight : "300"}}>
          And make new friends here worldwide and start your first conversation easily...
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit = {handleSubmit} >
            <Lottie options={defaultOptions} height= {200} width = {200} />
            <input type = "email" placeholder="Email" className="loginInput" required ref = {email} />
            <input type = "password" placeholder="Password" className="loginInput" required ref = {password} minLength = "6"/>
            <button disabled = {isFetching} className="loginButton">{isFetching ?<CircularProgress color = "white" size = "20px"/> : "GET INSIDE"}</button>
            <Link to = "/register" className="loginRegisterButton">
              Create new account ? SIGNUP
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
