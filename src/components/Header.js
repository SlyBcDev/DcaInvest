import React, { useState, useEffect } from 'react';
import {NavLink, Link} from 'react-router-dom';
import LineIcon from 'react-lineicons';
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import {DCAContract,DCAToken,DCAAddr, web3} from "../config/contractsConfig";
import {Grid} from '@agney/react-loading';
import {ChainId, Token, WETH, Fetcher, Route} from "@uniswap/sdk"
import DCAPriceReducer from '../store/DCAPrice';


function Header(){
    const [navigationToggler, setNavigationToggler] = useState(false);
    const accountRedux = useSelector((state) => state.account.address);
    const balanceRedux = useSelector((state) => state.balance.balance);
    const DCAPriceRedux = useSelector((state) => state.DCAPrice.price);
    const pendingReward = useSelector((state) => state.reward.pending);


    const dispatch = useDispatch();

    const handleNavigationToggler = () =>{
        setNavigationToggler(!navigationToggler);
    }

    useEffect(() =>{
        getBlockNumber()
        getBalance()
        getMyContract()
    }, [accountRedux])

    useEffect(()=>{
      getDCAPrice()
    },[])

    const connectWallet = async ()=>{
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await window.web3.eth.getAccounts();

          dispatch({
            type: "REFRESH_ACCOUNT_ADDRESS",
            payload: accounts[0],
          }) 


        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
    }

    const getBalance = async () => {
        if(accountRedux){
            const balance = await DCAToken.methods.balanceOf(accountRedux).call();
            if(balance){
              dispatch({
                  type: "REFRESH_BALANCE",
                  payload: balance,
                }) 
            } else {
              dispatch({
                  type: "REFRESH_BALANCE",
                  payload: 0,
                })  
            }
            let reward = await DCAContract.methods.myRewardsStock(accountRedux).call()
            dispatch({
              type: "REFRESH_REWARD",
              payload: (reward/1E18).toFixed(2),
            })  
        }

    }

    const getBlockNumber = async () => {
        web3.eth.getBlockNumber( (error, result)=> {
            if(!error) {
              dispatch({
                type: "REFRESH_BLOCK",
                payload: result,
              })  
            }
          })
    }

    const getMyContract = async() => {
      if(accountRedux){
        let myDcaContract = await DCAContract.methods.getMyContract(accountRedux).call();
        dispatch({
          type: "REFRESH_MY_CONTRACT",
          payload: myDcaContract,
        })  

        let myWithdrawPlan = await DCAContract.methods.myWithdrawPlan(accountRedux).call();
        dispatch({
          type: "REFRESH_MY_WITHDRAW",
          payload: myWithdrawPlan,
        })  
  
      }
    }

    const getDCAPrice = async ()=> {
      const DCA = new Token(ChainId.KOVAN, DCAAddr,  18);
      const pair = await Fetcher.fetchPairData(DCA, WETH[DCA.chainId])
      const route = new Route([pair], WETH[DCA.chainId])
      
      const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6)
      const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18)
  
      const USDCWETHPair = await Fetcher.fetchPairData(USDC, WETH[ChainId.MAINNET])
      const DAIUSDCPair = await Fetcher.fetchPairData(DAI, USDC)
  
      const route2 = new Route([USDCWETHPair, DAIUSDCPair], WETH[ChainId.MAINNET])
  
      const EthPrice = route2.midPrice.toSignificant(6);
      const DCAFor1Eth = route.midPrice.toSignificant(6);
      const DCAPrice = EthPrice/DCAFor1Eth;
  
      dispatch({
        type: "REFRESH_PRICE",
        payload: DCAPrice.toFixed(6),
      }) 
  
    }


    return (
        <nav className={navigationToggler ? "mi-header is-visible" : "mi-header"}>
            <button onClick={handleNavigationToggler} className="mi-header-toggler">
                {!navigationToggler ? <LineIcon name="menu" /> : <LineIcon name="close" />}
            </button>
            
            <div className="mi-header-inner">

                <div className="mi-header-image">
                    <Link to="/">
                        <img src={"../../images/takemymoney.png"} style={{height:180}} alt="good investissor"/>
                    </Link>
                    <span>DCA Finance</span>

                    
                </div>
                <span>$DCA = {DCAPriceRedux} $</span>
                
                {accountRedux.length>0?
                
                <ul className="mi-header-menu" style={{fontSize:12}}>
                        <li >
                        {accountRedux.substr(0,6)}...{accountRedux.substr(36,42)}
                        </li>
                        <li>
                            Balance : {balanceRedux>0?(balanceRedux/1E18).toFixed(2): 0} $DCA
                        </li>
                        <li>
                            Pending Rewards : {pendingReward>0?pendingReward: 0} $DCA
                        </li>
                        </ul>
                       
                        :
                 <span onClick= {()=>connectWallet()} style={{cursor:"pointer"}}>
                 Connect your Wallet
                </span>
                
                }
                              
                <ul className="mi-header-menu">
                    <li><NavLink to="/"><span>Home</span></NavLink></li>
                    <li><NavLink to="/DCAContract"><span>My DCA Contract</span></NavLink></li>
                    <li><NavLink to="/WithdrawPlan"><span>My Withdraw Plan</span></NavLink></li>
                </ul>
                <p className="mi-header-copyright">&copy; {new Date().getFullYear()} <b><a rel="noopener noreferrer" >DCA Coin Finance</a></b></p>
            </div>
        </nav>
    )
}


export default Header;