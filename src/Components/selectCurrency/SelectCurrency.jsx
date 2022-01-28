import React, { Component } from "react";
import { gql } from "@apollo/client";
import { client } from "../../index";
import { ReactComponent as Cart } from "../../Assets/shopping-cart-svgrepo-com.svg";
import { connect } from "react-redux";
import { toggleCartHidden } from "../../Redux/Cart/cart.actions";
import { selectCurrency } from "../../Redux/Currency/currency.actions";
import { ReactComponent as DownArrow } from "../../Assets/down-arrow-svgrepo-com.svg";
import { ReactComponent as UpArrow } from "../../Assets/up-arrow-svgrepo-com.svg";

import "./selectCurrency.styles.scss";

const SELECT_CURRENCY = gql`
  query {
    currencies {
      label
      symbol
    }
  }
`;

class SelectCurrency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      show: false,

      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  componentDidMount() {
    this.getCurrencies();
  }

  async getCurrencies() {
    const response = await client.query({
      query: SELECT_CURRENCY,
    });
    this.setState({ data: response.data });
  }

  chooseCurrency() {
    const { data, show } = this.state;

    return data.currencies?.map((currency, index) => {
      return show ? (
        <li value={index} key={index}>
          {currency.symbol} {currency.label}
        </li>
      ) : (
        ""
      );
    });
  }

  modalIcon() {
    const { value } = this.state;
    if (value === 0) {
      return "$";
    } else if (value === 1) {
      return "£";
    } else if (value === 2) {
      return "A$";
    } else if (value === 3) {
      return "¥";
    } else return "₽";
  }

  handleClick = () => {
    if (!this.state.show) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      show: !prevState.show,
    }));
  };

  handleOutsideClick = (e) => {
    if (!this.node.contains(e.target)) {
      this.handleClick();
    }
  };

  render() {
    const itemCount = this.props.itemCount;
    const selectCurrency = this.props.selectCurrency;

    const { value, show } = this.state;
    selectCurrency(value);

    return (
      <div className="currency">
        <div
          className="symbol"
          ref={(node) => {
            this.node = node;
          }}
          onClick={() => this.handleClick()}
        >
          {this.modalIcon()}{" "}
          {show ? (
            <UpArrow className="down-arrow" />
          ) : (
            <DownArrow className="down-arrow" />
          )}
          <ul value={this.state.value} onClick={this.handleChange}>
            {this.chooseCurrency()}
          </ul>
        </div>

        <div className="toggle" onClick={() => this.props.toggleCartHidden()}>
          <Cart className="shoppingCart" />

          <span className="item-count">{itemCount}</span>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleCartHidden: () => dispatch(toggleCartHidden()),
  selectCurrency: (props) => dispatch(selectCurrency(props)),
});

const mapStateToProps = ({ cart: { cartItems } }) => ({
  itemCount: cartItems.reduce(
    (accQuantity, cartItem) => accQuantity + cartItem.quantity,
    0
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectCurrency);
