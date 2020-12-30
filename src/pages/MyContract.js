import React,{useEffect, useState} from "react";
import Particles from "react-particles-js";
import Layout from "../components/Layout";
import {DCAContract,DCAContractAddr,DCAToken, web3} from "../config/contractsConfig";
import {ButtonGroup,ToggleButton, InputGroup,FormControl, Button} from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import {Grid} from '@agney/react-loading';
import Sectiontitle from "../components/Sectiontitle";


function MyContract() {
  const accountRedux = useSelector((state) => state.account.address);
  const myContract = useSelector((state)=>state.myContract.contract);

  const [wait,setWait] = useState(false);
  const [contractType, setType] = useState("No contract");
  const [reward, setReward] =useState(0);
  const [beginingTime, setBeginingTime] = useState(0);
  const [nextCall, setNextCall] = useState(0);
  const [deadLine, setDeadLine] =  useState(0);
  const [ethToInvest, setEth] = useState(0);
  const [dcaBought,setDcaBougt] = useState(0);
  const [callRemaining,setCallRemaining] = useState(0);

  const dispatch = useDispatch();



  useEffect(()=>{
    initValues()
  },[myContract])

 const initValues = () => {
  if(myContract){
    if(myContract._timeBetween2Calls == 86400){
      setType("Daily")
    }
    if(myContract._timeBetween2Calls == 604800){
      setType("Weekly")
    }
    if(myContract._timeBetween2Calls == 259200){
      setType("Monthly")
    }

    setReward(myContract._rewardPercentage/100)
    setCallRemaining(myContract._callRemaining)
    setDcaBougt((myContract._dcaBought/1E18).toFixed(2))
    setBeginingTime((new Date(parseInt(myContract._beginingTime)*1000)).toGMTString())
    setNextCall((new Date(parseInt(myContract._timeForNextCall)*1000)).toGMTString())
    setDeadLine((new Date((parseInt(myContract._timeForNextCall)+parseInt(myContract._timeBetween2Calls))*1000)).toGMTString())
    setEth(myContract._ethToInvest)
  }
 
 }

 const fulfill = async()=> {
  if(!accountRedux){
    alert("Please connect your wallet")
  }else{
    setWait(true)
      await DCAContract.methods.fulfillTestContract()
        .send({from:accountRedux,value:web3.utils.toWei(ethToInvest,'wei')})
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
        let myDcaContract = await DCAContract.methods.getMyContract(accountRedux).call();

        setCallRemaining(myDcaContract._callRemaining)
        setDcaBougt((myDcaContract._dcaBought/1E18).toFixed(2))
        setNextCall((new Date(parseInt(myDcaContract._timeForNextCall)*1000)).toGMTString())
        setDeadLine((new Date((parseInt(myDcaContract._timeForNextCall)+parseInt(myContract._timeBetween2Calls))*1000)).toGMTString())
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
                  My  <span className="color-theme">DCA Contract</span>
                </h1>

         
              </div>
              <div style={{display:"flex", justifyContent:"center", textAlign:"center"}}>
              <div className="card" style={{width: "18rem"}}>
                  <div className="card-body">
                    <h5 className="card-title" style={{color:"grey"}}>Opened DCA Contract</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Type: {contractType} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Started:  {beginingTime} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Next Call: {nextCall} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Dead Line: {deadLine} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">ETH to invest: {(ethToInvest/1E18).toFixed(2)} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Total DCA Bought: {dcaBought} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Call Remaining: {callRemaining} </h6>
                    <h6 className="card-subtitle mb-2 text-muted">REWARD: {reward} % </h6>
                    <Button variant="secondary" size="lg" block onClick={fulfill}>
                        Add ETH
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

export default MyContract;
