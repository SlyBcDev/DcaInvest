const myWithdrawReducer = (state = { withdrawPlan: {} }, action) => {
  switch (action.type) {
    case "REFRESH_MY_WITHDRAW":
      return {
        ...state,
        withdrawPlan: action.payload,
      };
    default:
      return state;
  }
};

export default myWithdrawReducer;