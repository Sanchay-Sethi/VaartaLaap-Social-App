import Lottie from "react-lottie";
import loadinganim from "../../assets/loading"
const Loading = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loadinganim,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };
    return (
        <div style = {{width: "100%",height: "100vh", position : "fixed", top : "0", left : "0"
            ,background : "whitesmoke", display : "flex", justifyContent : "center", alignItems : "center"}}>
               <Lottie options={defaultOptions} height= {500} width = {500}/>
        </div>
    )
}

export default Loading
