import React, { createContext } from "react";
import {
  BrowserRouter as Router, 
  Route, Switch
} from "react-router-dom";
import AuthNav from "./pages/Auth/AuthNav";
import Main from "./pages/Main/Main";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path = "/" render = {() => <Main />}></Route>
        <Route path = "/order/:step" render = {() => <AuthNav />}></Route>
      </Switch>
    </Router>
  )
}

export default App;