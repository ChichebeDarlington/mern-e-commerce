import axios from "axios";
import { useEffect, useReducer } from "react";
import { reducer } from "./reducer";
import Product2 from "./Product2";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

const initialState = { products: [], isLoading: true, error: "" };
const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const results = await axios("/api/products");
        const { data } = results;
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Products Feature</h1>
      <div className="products">
        {state.isLoading ? (
          <LoadingBox />
        ) : state.error ? (
          <MessageBox variant="danger">{state.error}</MessageBox>
        ) : (
          state.products.map((product) => {
            return (
              <div className="" key={product.slug}>
                <div className=" ">
                  <Product2 key={product.slug} product={product} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default HomePage;
