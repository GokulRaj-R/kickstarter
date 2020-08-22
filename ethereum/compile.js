const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    output: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

fs.ensureDirSync(buildPath);
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts.output;
for (let contractName in output) {
  fs.writeFileSync(
    path.resolve(buildPath, contractName + ".json"),
    JSON.stringify(output[contractName])
  );
}
