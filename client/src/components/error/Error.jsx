import Lottie from "react-lottie";
import error from "../../assets/error"
import Topbar from "../topbar/Topbar";
const Error = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: error,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };
    return (
        <>
        <Topbar/>
        <div style = {{width: "100%",height: "100vh", position : "fixed", top : "0", left : "0"
            ,background : "white", display : "flex", justifyContent : "center", alignItems : "center"}}>
               <Lottie options={defaultOptions} height= {800} width = {1000} />
        </div>
        </>
    )
}

export default Error
