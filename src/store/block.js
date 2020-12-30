const blockReducer = (state = { number: "" }, action) => {
    switch (action.type) {
      case "REFRESH_BLOCK":
        return {
          ...state,
          number: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default blockReducer;