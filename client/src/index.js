const displayHelloWorld = async (helloworld, contract) => {
    helloworld = await contract.methods.helloFromOwner().call();
    $("h2").html(helloworld);
  };
  
  async function hellowWorldApp() {
    const web3 = await getWeb3();
    // const accounts = await web3.eth.getAccounts();
    const contract = await getContract(web3);
    let helloworld;
    displayHelloWorld(helloworld, contract);
    // updateGreeting(greeting, contract, accounts);
  }
  
  hellowWorldApp();