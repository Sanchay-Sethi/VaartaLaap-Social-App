import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Friends from "./pages/friends/Friends";
import {Route, Switch,  BrowserRouter as Router, Redirect} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import Error from "./components/error/Error";

function App() {

  const {user} = useContext(AuthContext)
  return(
  <Router>
    <Switch>
      <Route exact path = "/">
        {user ? <Home/> : <Register/>}
      </Route>
      <Route exact path = "/findfriends">
        {user ? <Friends/> : <Register/>}
      </Route>
      <Route path = "/login">
       {user ? <Redirect to = "/"/> : <Login/>}
      </Route>
      <Route path = "/register">
      {user ? <Redirect to = "/"/> : <Register/>}
      </Route>
      <Route path = "/messenger">
      {!user ? <Redirect to = "/"/> : <Messenger/>}
      </Route>
      <Route exact path = "/profile/:username">
      {user ? <Profile/> : <Register/>}
      </Route>
      <Route path = "*">
        <Error/>
      </Route>
    </Switch>
  </Router>
  )
}

export default App;
