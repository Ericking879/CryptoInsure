const displayHelloWorld = async (helloworld, contract) => {
    helloworld = await contract.methods.helloFromOwner().call();
    $("h2").html(helloworld);
  };
  
  async function runWeb3() {
    web3 = await getWeb3();
    accounts = await web3.eth.getAccounts();
    window.contract = await getContract(web3);
    console.log(contract);
    // updateGreeting(greeting, contract, accounts);
  }
  
var web3;
var accounts;
runWeb3();