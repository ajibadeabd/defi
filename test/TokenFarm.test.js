const { assert } = require("chai");

/* eslint-disable no-undef */
const Daitoken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let dapToken, daiToken, tokenFarm;

  before(async () => {
    daiToken = await Daitoken.new();
    dapToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dapToken.address, daiToken.address);

    await dapToken.transfer(tokenFarm.address, tokens("1000000"));
    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Dai deployment", async () => {
    it("daiToken has a name", async () => {
      const name = await daiToken.name();
      console.log(name);
      assert.equal(name, "Mock DAI Token");
    });
  });
  describe("Dapp deployment", async () => {
    it("dappToken has a name", async () => {
      const name = await dapToken.name();
      console.log(name);
      assert.equal(name, "DApp Token");
    });
  });
  describe("tokenFarm deployment", async () => {
    it("daiToken has a name", async () => {
      const name = await tokenFarm.name();
      console.log(name);
      assert.equal(name, "Dapp Token Farm");
    });
  });
  describe("token farm has dap token total supply", async () => {
    it(" has total supply", async () => {
      const balance = await dapToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("farm token", async () => {
    it(" has total supply", async () => {
      const balance = await daiToken.balanceOf(investor);
      assert.equal(balance.toString(), tokens("100"));
    });
    it(" stake dai token", async () => {
      const approve = await daiToken.approve(tokenFarm.address, tokens("10"), {
        from: investor
      });
      const staketoken = await tokenFarm.stakeTokens(tokens("10"), {
        from: investor
      });
      const balance = await daiToken.balanceOf(investor);
      // const balance = await daiToken.balanceOf(owner);
      console.log(balance.toString())
      console.log(balance1.toString())
      assert.equal(balance.toString(), tokens("90"));
    });
  });
});
