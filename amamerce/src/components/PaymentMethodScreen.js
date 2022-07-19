import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "./CheckoutSteps";

const PaymentMethodScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxdispatch } = useContext(Store);
  const {
    cart: { shippingAddress, PaymentMethod },
  } = state;
  const [PaymentMethodName, setPaymentMethod] = useState(
    PaymentMethod || "Paypal"
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    ctxdispatch({ type: "SAVE_PAYMENT_METHOD", payload: PaymentMethodName });
    localStorage.setItem("paymentMethod", PaymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="small-container">
        <Helmet>
          <title>Payment method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Paypal"
              label="Paypal"
              value="Paypal"
              checked={PaymentMethodName === "Paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={PaymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div>
          <div className="mb-3">
            <Button type="submit">pay</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodScreen;
