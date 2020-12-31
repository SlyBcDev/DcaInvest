import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";
import MyContract from "./pages/MyContract";
import WithdrawPlan from "./pages/WithdrawPlan";
import Notfound from "./pages/Notfound";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import accountReducer from "./store/account";
import balanceReducer from "./store/balance";
import allowanceReducer from "./store/allowance";
import myWithdrawReducer from "./store/myWithdrawPlan";
import myContractReducer from "./store/myDcaContract";
import blockReducer from "./store/block";
import DCAPriceReducer from "./store/DCAPrice"
import rewardReducer from "./store/reward"


const rootReducer = combineReducers({
  account : accountReducer,
  balance : balanceReducer,
  allowance : allowanceReducer,
  block : blockReducer,
  myContract: myContractReducer,
  myWithdraw: myWithdrawReducer,
  DCAPrice : DCAPriceReducer,
  reward:rewardReducer,
});

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/DCAContract" exact component={MyContract} />
        <Route path="/WithdrawPlan" exact component={WithdrawPlan} />
        <Route path="*" component={Notfound} />
      </Switch>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
