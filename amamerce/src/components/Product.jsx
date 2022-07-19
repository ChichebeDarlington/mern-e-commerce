import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { reducer2 } from "./reducer";
import axios from "axios";
import Rating from "./Rating";
import { Helmet } from "react-helmet-async";
import { getError } from "../utils";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";
import { useContext } from "react";
import { Store } from "../Store";

const initialState = { product: [], isLoading: true, error: "" };
const Product = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [state, dispatch] = useReducer(reducer2, initialState);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const results = await axios(`/api/products/slug/${slug}`);
        const { data } = results;
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchProducts();
  }, [slug]);
  const { state: state1, dispatch: ctxdispatch } = useContext(Store);
  const { cart } = state1;
  const addToCartHandler = async () => {
    const existItem = cart.cartItem.find(
      (item) => item._id === state.product._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios(`/api/products/${state.product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry Product out of stock");
      return;
    }
    ctxdispatch({
      type: "CART_ADD_ITEM",
      payload: { ...state.product, quantity },
    });
    navigate("/cart");
  };

  if (state.isLoading) {
    return <LoadingBox />;
  }
  if (state.error) {
    console.log(state.error);
    return <MessageBox variant="danger">{state.error}</MessageBox>;
  }
  return (
    <>
      <Helmet>
        <title>{state.product.name}</title>
      </Helmet>
      <div className="row">
        <div className="col-md-4">
          <img
            src={state.product.image}
            alt={state.product.name}
            style={{ width: "50%" }}
          />
        </div>
        <div className="col-12">
          <Rating />
        </div>
        <div className="col-md-6">
          <p>{state.product.name}</p>
          <p>price: ${state.product.price}</p>
          <p>{state.product.desc}</p>
        </div>
        <div className="row">
          <div className="col">
            <span>Status:</span>
            {state.product.countInStock > 0 ? (
              <div className="bg-success">In stock</div>
            ) : (
              <div className="bg-danger">Out of stock</div>
            )}
          </div>
        </div>
        {state.product.countInStock > 0 && (
          <div className="btn">
            <button className="btn btn-primary " onClick={addToCartHandler}>
              Add To Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Product;
