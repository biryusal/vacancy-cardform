import React from "react";
import { Route } from "react-router";
import AuthPage from "..";

export default () => {
  return(
    <>
      <Route exact path = "/order/delivery" render = {() => <AuthPage isDeliveryPage = {true}/>}></Route>
      <Route exact path = "/order/payment" render = {() => <AuthPage isPaymentPage = {true}/>}></Route>
      <Route exact path = "/order/payment/successful" render = {() => <AuthPage isPaymentSuccessful = {true}/>}></Route>
    </>
  )
}