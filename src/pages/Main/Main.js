import React from "react";
import { NavLink } from "react-router-dom";
import HelloIcon from "../../img/hello.svg";
import "./Main.scss";

export default () => {
  return (
    <>
      <main className = "main__wrapper">
        <div className = "main__container">
          <div className = "main__headImg">
            <HelloIcon />
          </div>
          <h2 className = "main__header">Привет.</h2>
          <NavLink className = "main__link" to = "/order/delivery">К заданию</NavLink>
        </div>
      </main>
    </>
  )
}