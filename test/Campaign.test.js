const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const Factory = require("../ethereum/build/Factory.json");
const Campaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(Factory.abi)
    .deploy({ data: Factory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
});

describe("Contract", () => {
  it("deploys a factory and campaign", () => {
    assert.ok(campaign);
    assert.ok(factory);
  });

  it("allows manager to make a spend request", async () => {
    await campaign.methods
      .createRequest("Buy Batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy Batteries", request.description);
  });
});
