export const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, isLoading: false };
    case "FETCH_FAIL":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const reducer2 = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, isLoading: false };
    case "FETCH_FAIL":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
