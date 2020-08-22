const hdWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const Factory = require("./build/Factory.json");

const provider = new hdWalletProvider(
  "cook nest point drink century below toss club annual spatial metal year",
  "https://rinkeby.infura.io/v3/8a2169fa16fb4ed0b9021e87489f6242"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Account Manager : ", accounts[0]);

  const result = await new web3.eth.Contract(Factory.abi)
    .deploy({ data: Factory.evm.bytecode.object })
    .send({ gas: 1000000, from: accounts[0] });

  console.log("Contract Address : ", result.options.address);
};
deploy();

// Deployed Address : 0x265911347D873d0ef129AFA330Fa01A26FBC62c6
