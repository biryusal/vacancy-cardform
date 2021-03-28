import React, { createContext } from "react";
import {
  BrowserRouter as Router, 
  Route, Switch
} from "react-router-dom";
import AuthNav from "./pages/Auth/AuthNav";

function App() {
  return (
    <Router>
      <Switch>
        <Route path = "/order/:step" render = {() => <AuthNav />}></Route>
      </Switch>
    </Router>
  )
}

export default App;