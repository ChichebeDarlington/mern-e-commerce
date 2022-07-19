import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "./MessageBox";
import { Link, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

export const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxdispatch } = useContext(Store);
  const {
    cart: { cartItem },
  } = state;

  const handleInc = async (item, quantity) => {
    const { data } = await axios(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Product out of stock");
      return;
    }
    ctxdispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const handleTrash = (item) => {
    ctxdispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = (item) => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <Row>
        <Col md={8}>
          {cartItem.length === 0 ? (
            <MessageBox>
              Cart is empty.
              <Link to="/">Go shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItem.map((item) => {
                return (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-item-center">
                      <Col md={4}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <Button
                          variant="light"
                          disabled={item.quantity === 1}
                          onClick={() => handleInc(item, item.quantity - 1)}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                          onClick={() => handleInc(item, item.quantity + 1)}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                      <Col md={2}>
                        <Button
                          variant="light"
                          disabled={item.quantity === 0}
                          onClick={() => handleTrash(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    ( Subtotal{" "}
                    {cartItem.reduce((acc, curr) => {
                      return acc + curr.quantity;
                    }, 0)}
                    item ) : $
                    {cartItem.reduce((acc, curr) => {
                      return acc + curr.price * curr.quantity;
                    }, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={cartItem.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed to checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
