// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17;

contract Factory {
    address payable[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address payable newCampaign = payable(address(new Campaign(minimum, msg.sender)));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    uint numRequests;
    mapping(address => bool) public approvers;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint  minimum, address creator) {
        numRequests = 0;
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        requests.push({});
        Request storage newRequest = requests[numRequests++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}

