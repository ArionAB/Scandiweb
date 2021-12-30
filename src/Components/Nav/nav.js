import React, { Component } from "react";
import CategoryName from "../../Components/Category/CategoryName";
import SelectCurrency from "../../Components/selectCurrency/SelectCurrency";
import Logo from "../../Assets/shopping-bag-svgrepo-com.svg";

import "./nav.styles.scss";
class Nav extends Component {
  render() {
    return (
      <div className="nav">
        <CategoryName />
        <img src={Logo} className="logo" alt="Logo"></img>
        <SelectCurrency />
      </div>
    );
  }
}

// <img src={require(`../images/arc0${i + 1}.jpg`).default}
export default Nav;
