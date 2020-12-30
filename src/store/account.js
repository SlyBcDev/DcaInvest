const accountReducer = (state = { address: "" }, action) => {
    switch (action.type) {
      case "REFRESH_ACCOUNT_ADDRESS":
        return {
          ...state,
          address: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default accountReducer;