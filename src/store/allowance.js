const allowanceReducer = (state = { allowance: "" }, action) => {
    switch (action.type) {
      case "REFRESH_ALLOWANCE":
        return {
          ...state,
          allowance: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default allowanceReducer;