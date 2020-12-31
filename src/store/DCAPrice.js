const DCAPriceReducer = (state = { price: 0 }, action) => {
    switch (action.type) {
      case "REFRESH_PRICE":
        return {
          ...state,
          price: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default DCAPriceReducer;