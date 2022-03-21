import React, { useState } from "react";
import dai from "../dai.png";

const Main = props => {
  const {
    dappTokenContract,
    daiTokenContract,
    tokenFarmContract,
    dappTokenBalance,
    daiTokenBalance,
    farmTokenBalance,
    stake,
    unstake
  } = props;

  console.log({
    farmTokenBalance
  });
  const [input, setInput] = useState("");
  return (
    <div id="content" className="mt-3">
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{farmTokenBalance} mDAI</td>
            <td>{dappTokenBalance} DAPP</td>
          </tr>
        </tbody>
      </table>

      <div className="card mb-4">
        <div className="card-body">
          <form
            className="mb-3"
            onSubmit={event => {
              event.preventDefault();
              stake(window.web3.utils.toWei(input, "Ether"));
              // let amount;
            }}
          >
            <div>
              <label className="float-left">
                <b>Stake Tokens</b>
              </label>
              <span className="float-right text-muted">
                Balance: {daiTokenBalance}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                }}
                className="form-control form-control-lg"
                placeholder="0"
                required
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={dai} height="32" alt="" />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              STAKE!
            </button>
          </form>
          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={event => {
              unstake();
            }}
          >
            UN-STAKE...
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
