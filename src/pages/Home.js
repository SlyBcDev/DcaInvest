import React,{useEffect, useState} from "react";
import Particles from "react-particles-js";
import Layout from "../components/Layout";
import {DCAContract,DCAContractAddr,DCAToken,DCAAddr, web3} from "../config/contractsConfig";
import {ButtonGroup,ToggleButton, InputGroup,FormControl, Button} from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import {Grid} from '@agney/react-loading';
import Sectiontitle from "../components/Sectiontitle";



function Home() {
  const accountRedux = useSelector((state) => state.account.address);



  const typeOfContract = [
    {name : "Daily", value:0},
    {name : "Weekly", value:1},
    {name : "Monthly", value:2},
  ]
  const [contractType, setContractType] = useState(0);
  const dailyPeriod = [3,10,15,20];
  const weeklyPeriod = [4,8,12,20];
  const MonthlyPeriod = [3,6,9,12];
  const currentPeriod = contractType === 0 ? dailyPeriod:
       contractType === 1 ? weeklyPeriod : MonthlyPeriod;

  const [periodSelected, setPeriod] = useState(3);
  const [ethValue, setEthValue] = useState(0.00);
  const [percentReward, setPercentReward] = useState(0)
  const [APY, setAPY] = useState(0);
  const [wait, setWait] = useState(false);
  const [inputBgColor, setColor] = useState("white")

  useEffect(()=>{
    getReward()
  },[ethValue,periodSelected,contractType])

  const getReward= async()=> {
    if(ethValue>0){
      let reward = await DCAContract.methods.getInterestPercent(contractType,periodSelected,web3.utils.toWei(ethValue,'ether')).call();
      setPercentReward(reward)
      if(contractType ===0){
        reward = reward / periodSelected
        setAPY(reward*365)
      }
      if(contractType ===1){
        reward = reward / periodSelected
        setAPY(reward*52)
      }
      if(contractType ===2){
        reward = reward / periodSelected
        setAPY(reward*12)
      }
    }
  }

  const openContract = async()=> {
    if(!accountRedux){
      alert("Please connect your wallet")
    }else{
    if(ethValue===0){
      setColor("red")
      setTimeout(()=>{
        setColor("white")
      },2000)
    }else{
      setWait(true)
      if(contractType===0){
        await DCAContract.methods.openDailyContract(periodSelected)
          .send({from:accountRedux,value:web3.utils.toWei(ethValue,'ether')})
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
      }
      if(contractType===1){
        await DCAContract.methods.openWeeklyContract(periodSelected)
          .send({from:accountRedux,value:web3.utils.toWei(ethValue,'ether')})
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
      }
      if(contractType===2){
        await DCAContract.methods.openMonthlyContract(periodSelected)
          .send({from:accountRedux,value:web3.utils.toWei(ethValue,'ether')})
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
      }
      setWait(false)
    }
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
                  Welcome to  <span className="color-theme">DCA Invest</span>
                </h1>
         
              </div>
              <div style={{display:"flex", justifyContent:"center", textAlign:"center"}}>
              <div className="card" style={{width: "18rem"}}>
                  <div className="card-body">
                    <h5 className="card-title" style={{color:"grey"}}>Open DCA Contract</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{typeOfContract[contractType].name} Contract</h6>
                    <ButtonGroup toggle>
                      {typeOfContract.map((contract, idx) => 
                      <ToggleButton
                          key={idx}
                          type="radio"
                          variant="secondary"
                          name="radio"
                          value={contract.value}
                          onChange={() => {
                            setContractType(contract.value)
                            if(contract.value === 1){
                              setPeriod(4)
                            }else{
                              setPeriod(3)
                            }
                          }}
                          checked={contractType === parseInt(contract.value)}
                        >
                          {contract.name}
                        </ToggleButton>
                      )}
                      </ButtonGroup>
                      <h6 className="card-subtitle mb-2 mt-2 text-muted">Period : </h6>
                      <ButtonGroup toggle>
                        {currentPeriod.map((period, idx) => 
                        <ToggleButton
                            key={idx}
                            type="radio"
                            variant="secondary"
                            name="radio"
                            value={period}
                            onChange={() => {
                              setPeriod(period)
                            }
                            }
                            
                            checked={periodSelected === parseInt(period)}
                          >
                            {period}
                          </ToggleButton>
                        )}
                      </ButtonGroup>
                      <h6 className="card-subtitle mb-2 mt-2 text-muted">Value : </h6>
                      <InputGroup className="mb-3">
                        <FormControl 
                          style={{"background":inputBgColor}}
                          type="number"
                          value={ethValue}
                          min="0.00"
                          step="0.01"
                          max="2.00"
                          onChange={(e)=>{
                            e.preventDefault()
                            setEthValue(e.target.value)
                            getReward()
                            }}/>
                        <InputGroup.Append>
                          <InputGroup.Text>ETH</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                      <h5 className="card-title" style={{color:"grey"}}>{percentReward/100} % REWARD</h5>
                      <h5 className="card-title" style={{color:"grey"}}>{(APY/100).toFixed(0)} % APY</h5>
                      <Button variant="secondary" size="lg" block onClick={openContract}>
                        Start
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

export default Home;
