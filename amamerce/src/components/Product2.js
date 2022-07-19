import { Link } from "react-router-dom";
import Rating from "./Rating";
import { Store } from "../Store";
import axios from "axios";
import { useContext } from "react";
import Button from "react-bootstrap/esm/Button";

const Product2 = ({ product }) => {
  const { image, name, slug, price, numOfReviews, rating, _id } = product;
  const { state, dispatch: ctxdispatch } = useContext(Store);
  const {
    cart: { cartItem },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItem.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios(`/api/products/${_id}`);
    if (data.countInStock < quantity) {
      window.alert("Product out of stock");
      return;
    }
    ctxdispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <div className="product">
      <Link to={`/product/${slug}`}>
        <img src={image} alt={name} />
      </Link>
      <div className="product-info">
        <Link to={`/product/${slug}`}>
          <h3>{name}</h3>
        </Link>
        <Rating rating={rating} numOfReviews={numOfReviews} />
        <p>${price}</p>
      </div>
      {product.countInStock === 0 ? (
        <Button disabled variant="light">
          Out of stock
        </Button>
      ) : (
        <button
          type="submit"
          className="btn btn-star"
          onClick={() => addToCartHandler(product)}
        >
          add to cart
        </button>
      )}
    </div>
  );
};

export default Product2;
