const balanceReducer = (state = { balance: "" }, action) => {
    switch (action.type) {
      case "REFRESH_BALANCE":
        return {
          ...state,
          balance: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default balanceReducer;