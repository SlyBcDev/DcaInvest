const rewardReducer = (state = { pending: "" }, action) => {
    switch (action.type) {
      case "REFRESH_REWARD":
        return {
          ...state,
          pending: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default rewardReducer;