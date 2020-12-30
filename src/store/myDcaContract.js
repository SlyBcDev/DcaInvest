const myContractReducer = (state = { contract: {} }, action) => {
    switch (action.type) {
      case "REFRESH_MY_CONTRACT":
        return {
          ...state,
          contract: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default myContractReducer;