import React, { useState, useEffect } from "react";
import Sectiontitle from "../components/Sectiontitle";
import Layout from "../components/Layout";
import RedPill from "../pictures/RedPill.png"
import BluePill from "../pictures/BluePill.png"
import {game,mgt,gameControllerAddr} from "../config/contractsConfig"
import { useDispatch, useSelector } from "react-redux";
import {Alert, Button} from 'react-bootstrap';

import {Grid} from '@agney/react-loading';

function Play(){

  const dispatch = useDispatch();

  const[pillChoice,setPillChoice] =useState(undefined);
  const[betValue, setBetValue] = useState(0);
  const[step,setStep] = useState(0);
  const[wait, setWait] = useState(false);
  const accountRedux = useSelector((state) => state.account.address);
  const allowance = useSelector((state) => state.allowance.allowance);
  const balance = useSelector((state) => state.balance.balance);
  const block = useSelector((state) => state.block.number);

  useEffect(() => { 
    getAllowance();
    return () => {
      reloadData()
    }
  }, [])

  const reloadData = ()=> {
    setStep(0);
    setPillChoice(undefined)
    setBetValue(0)
    getAllowance()
  }

  const doABet = async()=>{
    setWait(true)
    game.methods.choosePils(betValue,pillChoice)  
      .send({from:accountRedux})      
      .on('receipt', (result)=>{
        if(result.status){
          game.events.gotAResult({
            fromBlock: block,
            filter: {
              _player : accountRedux
            }},(err,res)=>{
            if(err){
              console.log(err)
              setStep(99)
            } else {
              getBalance();
              if(res.returnValues._result==="1"){
                setWait(false)
                setStep(77)
              } else {
                setWait(false)
                setStep(66)
              }

            }
          })

        } else {
          setStep(99)
        }
      })
      .on('error',(err,result)=>{
        if(err){
          console.log(err)
          setWait(false)
          setStep(99)
        } else {
          console.log(result)
        }
      })
  }

  const checkAllowance = () => {

    if(parseInt(allowance)>parseInt(betValue)*1E18){
      console.log("Allowance is good")
      return true
    } else {
      console.log("Allowance is not good")
      return false
    }
  }

  const getAllowance = async () => {
    if(accountRedux){
        const allowance = await mgt.methods.allowance(accountRedux,gameControllerAddr).call();
        console.log(allowance)
        if(allowance){
          dispatch({
              type: "REFRESH_ALLOWANCE",
              payload: allowance,
            }) 
        } else {
          dispatch({
              type: "REFRESH_ALLOWANCE",
              payload: 0,
            })  
        }
    }
}

  const getBalance = async () => {
    if(accountRedux){
        const balance = await mgt.methods.balanceOf(accountRedux).call();
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
    }

  }

  const approveForContract = async () => {
    mgt.methods.approve(gameControllerAddr,balance)
      .send({from:accountRedux})
      .on('receipt', (result)=>{
        if(result.status){
          getAllowance()
          setWait(false)
          setStep(3)
        } else {
          setStep(99)
        }
      })
      .on('error',(err,result)=>{
        if(err){
          console.log(err)
          setWait(false)
          setStep(99)
        } else {
          console.log(result)
        }
      })
      

  }

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

  if(step === 0){
    return(
      <Layout>
      <div className="mi-skills-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="Playing Morpheus Game" />
        </div>
        <h1 style={{marginLeft:"20px"}}>How to play ?</h1>
        <ol style={{marginLeft:"60px"}}>
          <li style={{fontWeight:"bold", color:"white", fontSize:22}}>
          Select your pill 
          </li>     
          <li style={{fontWeight:"bold", color:"white", fontSize:22}}>
          Select the amount you want to bet 
          </li>
          <li style={{fontWeight:"bold", color:"white", fontSize:22}}>
          Confirm 
          </li>
          <li style={{fontWeight:"bold", color:"white", fontSize:22}}>
          If you win, your portfolio will receive the double of MGT bet.
          If you lose, your counter raises and allocate a part of the redistribution
          </li>
        </ol>
        {accountRedux[0]+accountRedux[1] !== "0x"?

                  <div style={{marginLeft:"20px"}}>
                  Connect your wallet for playing ...
                  </div>:
                    <div style={{marginLeft:"20px"}}>
                      <h2>Select your pill :</h2>
                      <img onClick={
                        ()=>{
                          setPillChoice(0)
                          setStep(1)
                        }} src={BluePill} alt="pills" style={styles.pillStyles}/>
                      <img onClick={
                        ()=>{
                        setPillChoice(1)
                        setStep(1)
                        }}
                        src={RedPill} alt="pills" style={styles.pillStyles}/>
        
                    </div>
          }
          </div>
      </Layout>
      )
  }

  if(step === 1){
      return(
        <Layout>
        <div className="mi-skills-area mi-section mi-padding-top">
          <div className="container">
            <Sectiontitle title="Playing Morpheus Game" />
          </div>
          <div style={{marginLeft:"20px"}}>
            <h2>You choice :</h2>
            <img src={pillChoice===1? RedPill:BluePill} alt="pills" style={styles.pillStyles}/>
          </div>
          <div style={{margin:"20px"}}>
            <button style={{width:"140px",marginRight:"20px"}} className="mi-button" onClick={()=>setStep(0)}> Back </button>
            <button style={{width:"140px"}} className="mi-button" onClick={()=>setStep(2)}> Next </button>
          </div>
        </div>
      </Layout>
      )
  }

  if(step === 2){
    return(
      <Layout>
      <div className="mi-skills-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="Playing Morpheus Game" />
        </div>
        <div style={{marginLeft:"20px",marginRight:"400px"}}>
          <h2>Amount to bet* :</h2>
          <p style={{fontSize:12}}>* Max value 250 000 MGT</p>
          <div className="input-group input-group-lg">
            <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-lg">Amount</span>
            </div>
            <input type="number" className="form-control" value={betValue} max={250000} onChange={(e)=>{
              e.preventDefault()
              if(e.target.value<0){
                setBetValue(0)
              } else if(e.target.value>250000){
                setBetValue(250000)
              }else{
                setBetValue(e.target.value)
              }
              }}/>
          </div>
        </div>
        <div style={{margin:"20px"}}>
          <button style={{width:"140px",marginRight:"20px"}} className="mi-button" onClick={()=>setStep(1)}> Back </button>
          <button style={{width:"140px"}} className="mi-button" 
          onClick={
            ()=>{
              if(betValue>0){
                if(parseInt(balance)===0){
                  console.log("test")
                  setStep(88)
                } else if(!checkAllowance()){
                  setWait(true)
                  approveForContract()
                }else {
                setStep(3)
                }
              }
              }}> Next </button>
        </div>
      </div>
    </Layout>
    )
  }

  if(step === 3){
    return(
      <Layout>
      <div className="mi-skills-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="Playing Morpheus Game" />
        </div>
          <div className="alert alert-warning" role="alert" style={{marginLeft:"20px",marginRight:"400px"}}>
            {`You will play ${betValue} MGT on the ${pillChoice===1?"Red Pill":"Blue Pill"} `}
            Are you sure ?
          </div>
        <div style={{margin:"20px"}}>
          <button style={{width:"140px",marginRight:"20px"}} className="mi-button" onClick={()=>setStep(2)}> Back </button>
          <button style={{width:"140px"}} className="mi-button" onClick={()=>doABet()}> Betting </button>
        </div>
      </div>
    </Layout>
    )
  }

  if(step === 4){
    return(
      <Layout>
      <Alert show={true} variant="success" style={{width:600,marginTop:200,marginLeft:100,textAlign: "center"}}>
      <Alert.Heading>Happy to see you tried to play!</Alert.Heading>
      <p>
        Game isn't active yet. 
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={() => setStep(0)} variant="outline-success">
          Ok
        </Button>
      </div>
    </Alert>
     </Layout>

    )
  }

  if(step === 66){
    return(
      <Layout>
      <Alert show={true} variant="danger" style={{width:600,marginTop:200,marginLeft:100,textAlign: "center"}}>
      <Alert.Heading>Result</Alert.Heading>
      <img src={pillChoice===1? RedPill:BluePill} alt="pills" style={styles.pillStyles}/>
      <p>
        Unfortunatly you lost.
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={() => reloadData()} variant="outline-danger">
          Ok
        </Button>
      </div>
    </Alert>
     </Layout>

    )
  }

  if(step === 77){
    return(
      <Layout>
      <Alert show={true} variant="success" style={{width:600,marginTop:200,marginLeft:100,textAlign: "center"}}>
      <Alert.Heading>Result</Alert.Heading>
      <img src={pillChoice===1? RedPill:BluePill} alt="pills" style={styles.pillStyles}/>
      <p>
        You Win !!!
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={() => reloadData()} variant="outline-success">
          Ok
        </Button>
      </div>
    </Alert>
     </Layout>

    )
  }

  if(step === 88){
    return(
      <Layout>
      <Alert show={true} variant="danger" style={{width:600,marginTop:200,marginLeft:100,textAlign: "center"}}>
      <Alert.Heading>You need some MGT for playing</Alert.Heading>
      <p>
        You can participate to our ITO ... 
      </p>
      <p>
        Please visit our telegram ... 
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={() => reloadData()} variant="outline-danger">
          Ok
        </Button>
      </div>
    </Alert>
     </Layout>

    )
  }

  if(step === 99){
    return(
      <Layout>
      <Alert show={true} variant="danger" style={{width:600,marginTop:200,marginLeft:100,textAlign: "center"}}>
      <Alert.Heading>Sommething went wrong</Alert.Heading>
      <p>
        Transaction failed ... 
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={() => reloadData()} variant="outline-danger">
          Ok
        </Button>
      </div>
    </Alert>
     </Layout>

    )
  }

}

const styles = {
  pillStyles:{
    width:"300px",
    height:"300px",
    marginRight:"10px",
    marginTop:"20px",
    marginBottom:"20px",
    cursor: "pointer"
  }
}

export default Play;
