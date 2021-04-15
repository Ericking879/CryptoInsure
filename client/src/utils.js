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
    const data = await $.getJSON("contracts/CryptoInsure.json");
    const netId = await web3.eth.net.getId();
    const deployedNetwork = data.networks[netId];
    const newContract = new web3.eth.Contract(
      data.abi,
      deployedNetwork && deployedNetwork.address
    );
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