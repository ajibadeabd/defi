import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
import Main from "./Main";
import DaiTokenAbi from "../abis/DaiToken.json";
import DappTokenAbi from "../abis/DappToken.json";
import TokenFarmAbi from "../abis/TokenFarm.json";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("0x0");
  const [dappTokenContract, setDappTokenContract] = useState({});
  const [daiTokenContract, setDaiTokenContract] = useState({});
  const [tokenFarmContract, setTokenFarmContract] = useState({});

  const [daiToken, setDaiToken] = useState("0");
  const [dappToken, setDappToken] = useState("0");
  const [farmToken, setFarmToken] = useState("0");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3);
    } else {
      alert("blockchain browser not found .please install metamask");
    }
    // console.log(window.web3);
  };
  const loadBlockchainData = async () => {
    let web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    setAddress(accounts[0]);
    const networkId = await web3.eth.net.getId();
    // console.log(DaiTokenAbi.networks);
    // contract data
    const daiToken = DaiTokenAbi.networks[networkId];
    const dappToken = DappTokenAbi.networks[networkId];
    const tokenFarm = TokenFarmAbi.networks[networkId];
    // console.log({ address });

    if (daiToken) {
      const daiTokenContract = new web3.eth.Contract(
        DaiTokenAbi.abi,
        daiToken.address
      );
      setDaiTokenContract(daiTokenContract);
      const daiTokenBalance = await daiTokenContract.methods
        .balanceOf(accounts[0])
        .call();

      console.log(daiTokenBalance.toString());
      const balance = web3.utils.fromWei(daiTokenBalance.toString());
      // console.log(balance);
      setDaiToken(balance);
    }
    if (dappToken) {
      const dappTokenContract = new web3.eth.Contract(
        DappTokenAbi.abi,
        dappToken.address
      );

      setDappTokenContract(dappTokenContract);
      const dappTokenBalance = await dappTokenContract.methods
        .balanceOf(accounts[0])
        .call();
      console.log(dappTokenBalance.toString());
      const balance = web3.utils.fromWei(dappTokenBalance.toString());
      setDappToken(balance);
    }

    if (tokenFarm) {
      const tokenFarmContract = new web3.eth.Contract(
        TokenFarmAbi.abi,
        tokenFarm.address
      );
      setTokenFarmContract(tokenFarmContract);

      const TokenFarmBalance = await tokenFarmContract.methods
        .stakingBalance(accounts[0])
        .call();
      console.log({ TokenFarmBalance });
      const balance = web3.utils.fromWei(TokenFarmBalance.toString());
      setFarmToken(balance);
      console.log({ balance });
    }
  };
  const stake = amount => {
    daiTokenContract.methods
      .approve(tokenFarmContract._address, amount)
      .send({ from: address })
      .on("transactionHash", hash => {
        tokenFarmContract.methods.stakeTokens(amount).send({ from: address });

        const stakeResponse = tokenFarmContract.methods
          .stakeTokens(amount)
          .send({ from: address })
          .on("transactionHash", hash => {
            console.log(hash);
          });
      });

    // console.log({ stakeResponse });
  };
  const unstake = () => {
    tokenFarmContract.methods
      .unstakeTokens()
      .send({ from: address })

      .on("transactionHash", hash => {
        console.log(hash);
      });
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  let content;
  if (loading) {
    content = (
      <p id="loader" className="text-center">
        Loading...
      </p>
    );
  } else {
    content = (
      <Main
        dappTokenContract={dappTokenContract}
        daiTokenContract={daiTokenContract}
        tokenFarmContract={tokenFarmContract}
        dappTokenBalance={dappToken}
        daiTokenBalance={daiToken}
        farmTokenBalance={farmToken}
        stake={stake}
        unstake={unstake}
      />
    );
  }

  return (
    <div>
      <Navbar account={"account"} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">{content} </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
