import React,{useEffect, useState} from "react";
import Particles from "react-particles-js";
import Layout from "../components/Layout";
import {DCAContract,DCAContractAddr,DCAToken, web3} from "../config/contractsConfig";
import {ButtonGroup,ToggleButton, InputGroup,FormControl, Button} from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import {Grid} from '@agney/react-loading';
import Sectiontitle from "../components/Sectiontitle";


function WithdrawPlan() {
  const accountRedux = useSelector((state) => state.account.address);
  const myWithdrawPlan = useSelector((state)=>state.myWithdraw.withdrawPlan)

  console.log(myWithdrawPlan)
  const [wait,setWait] = useState(false);
  const [beginingTime, setBeginingTime] = useState(0);
  const [nextCall, setNextCall] = useState(0);
  const [period, setPeriod] =  useState(0);
  const [amountPerCall, setAmount] = useState(0);
  const [totalReward,setTotalReward] = useState(0);
  const [callRemaining,setCallRemaining] = useState(0)

  const dispatch = useDispatch();


  useEffect(()=>{
    initValues()
    getReward()
  },[myWithdrawPlan,accountRedux])

 const initValues = () => {
  if(myWithdrawPlan){
    setBeginingTime((new Date(parseInt(myWithdrawPlan.beginingTime)*1000)).toGMTString())
    setNextCall((new Date(parseInt(myWithdrawPlan.nextCall)*1000)).toGMTString())
    setCallRemaining(myWithdrawPlan.callRemaining)
    setPeriod(myWithdrawPlan.period)
    setAmount((myWithdrawPlan.amountPerCall/1E18).toFixed(2))
  }
 
 }

 const getReward = async () => {
   if(accountRedux){
     let reward = await DCAContract.methods.myRewardsStock(accountRedux).call()
    setTotalReward((reward/1E18).toFixed(2))
   }
 }

 const claimRewards = async()=> {
  if(!accountRedux){
    alert("Please connect your wallet")
  }else{
    setWait(true)
      await DCAContract.methods.claimMyRewardsStock()
        .send({from:accountRedux})
        .on('receipt', (result)=>{
          if(result.status){
            console.log(result)
            setWait(false)
          } else {
            setWait(false)
          }
        })
        .on('error',(err,result)=>{
          if(err){
            console.log(err)
            setWait(false)

          } else {
            console.log(result)
          }
        })

        let myWithdrawPlan = await DCAContract.methods.myWithdrawPlan(accountRedux).call();

        setNextCall((new Date(parseInt(myWithdrawPlan.nextCall)*1000)).toGMTString())
        setCallRemaining(myWithdrawPlan.callRemaining)
        setPeriod(myWithdrawPlan.period)
        setAmount((myWithdrawPlan.amountPerCall/1E18).toFixed(2))

    setWait(false)
  
}

  
}

  const paramConfig = {
    particles: {
      number: {
        value: 160,
        density: {
          enable: false
        }
      },
      color: {
        value: "#ffffff"
      },
      opacity: {
        value: 0.1
      },
      size: {
        value: 5,
        random: true,
        anim: {
          speed: 4,
          size_min: 0.3
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        random: true,
        speed: 1,
        direction: "top",
        out_mode: "out"
      }
    }
  };

  if(wait){
    return(
      <Layout>
      <div className="mi-skills-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="Please wait ..." />
          <Grid style={{height:"400",width:"600"}}/>
        </div>
      </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mi-home-area mi-padding-section">
        <Particles className="mi-home-particle" params={paramConfig} />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <div className="mi-home-content">
                <h1>
                  My  <span className="color-theme">Withdraw Plan</span>
                </h1>

         
              </div>
              <div style={{display:"flex", justifyContent:"center", textAlign:"center"}}>
              <div className="card" style={{width: "18rem"}}>
                  <div className="card-body">
                    <h5 className="card-title" style={{color:"grey"}}>Opened Plan</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Total Reward: {totalReward} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Started:  {beginingTime} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Next Call: {nextCall} </h6>

                    <h6 className="card-subtitle mb-2 text-muted">Call Remaining: {callRemaining} </h6>
                    <Button variant="secondary" size="lg" block onClick={claimRewards}>
                       Claim
                      </Button>
                  </div>
                </div> 
                 </div>        
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WithdrawPlan;
