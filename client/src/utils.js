const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      window.addEventListener("load", async () => {        
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // ask user permission to access his accounts
            await window.ethereum.request({ method: "eth_requestAccounts" });
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        } else {
          reject("Must install MetaMask");
          do_not_have_metamask();
        }
      });
    });
  };

const getContract = async (web3) => {
    // const data = await $.getJSON("contracts/CryptoInsure.json");
    // const netId = await web3.eth.net.getId();
    // const deployedNetwork = data.networks[netId];
    // const newContract = new web3.eth.Contract(
    //   data.abi,
    //   deployedNetwork && deployedNetwork.address
    // );

    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"cancelPolicy","outputs":[{"internalType":"bool","name":"cancelled","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"changeAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getLatestBNBPrice","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"clientAddress","type":"address"}],"name":"getNextInstallmentDate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"clientAddress","type":"address"}],"name":"hasPolicyMatured","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"makeClaim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"clientAddress","type":"address"}],"name":"ownerCancelPolicy","outputs":[{"internalType":"bool","name":"cancelled","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"clientAddress","type":"address"}],"name":"payInstallment","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amntToInsure","type":"uint256"},{"internalType":"uint256","name":"termInMonths","type":"uint256"}],"name":"registerPolicy","outputs":[{"internalType":"bool","name":"registered","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"clientAddress","type":"address"}],"name":"retrievePolicyDetails","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"totalRepayment","type":"uint256"},{"internalType":"uint256","name":"noOfInstallments","type":"uint256"},{"internalType":"uint256","name":"installmentAmount","type":"uint256"},{"internalType":"uint256","name":"waitingPeriod","type":"uint256"},{"internalType":"bool","name":"isInArrears","type":"bool"},{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"endDate","type":"uint256"},{"internalType":"bool","name":"pendingFirstInstallment","type":"bool"},{"internalType":"bool","name":"isBalanceToppedUp","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
    const address = "0x95a5303Ef880C79578cE9087cd99FcE79b8C7C9C";

    const newContract = new web3.eth.Contract(abi, address);

    return newContract;
};

function do_not_have_metamask() {
  if (window.matchMedia("only screen and (min-width: 700px)").matches) {
    document.getElementById("no-have-metamask").className = "not-have-metamask";
  }
  else {
    document.getElementById("no-have-metamask").className = "get-metamask";
  }
}