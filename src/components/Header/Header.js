import React from "react";
import GraphemeLogo from "../../img/Grapheme.logo.svg";
import "./Header.scss";

export default () => {
  return (
    <header className = "header__wrapper">
      <span className = "header__text">
        Тестовое задание
      </span>
      <div className = "header__logo">
        <GraphemeLogo />
      </div>
    </header>
  )
}