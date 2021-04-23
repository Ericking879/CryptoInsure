var policyDetails;
    
const seePolicyBtn = document.getElementById("see_my_policy");
      interact_right = document.getElementById("interact-right");

seePolicyBtn.addEventListener("click", () => {
    loadPolicyDetails();
});


const newPlanBtn = document.getElementById("submit-new-insurance-plan");
      payNowBtn = document.getElementById("pay-now");
      requestPayoutBtn = document.getElementById('request-payout');
      cancelPolicyBtn = document.getElementById('cancel-policy');

newPlanBtn.addEventListener("click", () => {
    createNewPlan();
});

payNowBtn.addEventListener("click", () => {
    payNow();
});

requestPayoutBtn.addEventListener("click", () => {
    requestPayout();
});

cancelPolicyBtn.addEventListener("click", () => {
    cancelPolicy();
});

async function createNewPlan() {
    const num_months = Number(document.getElementById("months-options").value);
    const tempAmount = Math.round((Number(document.getElementById("tokens_amount").value*100000)));//*(10**18);
    
    console.log(tempAmount);
    
    const BNBamount = tempAmount.toString()+"0000000000000";
    console.log(BNBamount);


    console.log(num_months + " months insuring " + BNBamount + " wei of BNB");

    await window.contract.methods.registerPolicy(BNBamount, num_months).send({
        from: accounts[0],
        value: BNBamount,
    });

    await loadPolicyDetails();
}

async function loadPolicyDetails() {
    const policyDisplay = document.getElementById("policy-details");
    const policyDetailsUser = await window.contract.methods.retrievePolicyDetails(accounts[0]).call();
    policyDetails = policyDetailsUser;

    let a = "<table>";
    let add_class = "";
    let b, d;
    let no_active_policy = false;
    let policyInArrears = false;
    for (const key in policyDetails) {
        console.log(`${key}: ${policyDetails[key]}`);
        
        if (key == "balance" && policyDetails[key] == 0) {
            a = a + "<th>No active policy for your wallet address</th>";
            no_active_policy = true;
            break;
        }


        if (key == "balance" || key == "totalRepayment" || key == "installmentAmount" || key == "bnbPriceAtStart") {
            b = policyDetails[key]/100000 + " BNB";
            if (key == "balance") {
                d = "Insured Balance";
            } else if (key == "totalRepayment") {
                d = "Total To Pay For Insurance";
            } else if (key == "bnbPriceAtStart") {
                d = "Starting Price";
                b = Math.round(policyDetails[key]/10**6)/100 + " BNB/USD";
            } else {
                d = "Payment Each Installment";
            }
        }
        else if (key == "startDate" || key == "endDate") {
            b = timeConverter(Number(policyDetails[key]));
            if (key == "startDate") {
                d = "Policy Start Date";
            } else {
                d = "Policy End Date";
            }
        }
        else {
            // b = "";
            b = policyDetails[key];
            if (key == "noOfInstallments") {
                d = "Installments Left To Pay";
            } else if (key == "waitingPeriod") {
                d = "Waiting Period";
                b = policyDetails[key] + " months";
            } else if (key == "isBalanceToppedUp") {
                if (policyDetails[key]) {
                    d = "Claim Approved";
                    b = "";
                    add_class = "class='confirm'";
                } else {
                    continue;
                }
            } else if (key == "isInArrears") {
                if (policyDetails[key]) {
                    policyInArrears = true;
                }
                continue;
            } else if (key == "pendingFirstInstallment") {
                if (policyDetails[key]) {
                    d = "Pay First Installment";
                    b = "";
                    add_class = "class='warning'";
                } else if (policyInArrears) {
                    d = "Policy Void, Late Payment";
                    b = "";
                    add_class = "class='warning'";
                } else {
                    continue;
                }
            } else {
                d = key;
            }
        }

        if (isNaN(Number(key))) {
            a = a +"<tr>" + "<th>" + "<div "+add_class+">" + d + "</div>" + "</th><td>" + b + "</td></tr>";
            // console.log("log ->", d, b);
        }
        add_class = "";
        
    }
    a = a + "</table>";
    
    // Hide contract interaction buttons if no policy exists
    // or show the buttons if one does exist.
    if (no_active_policy) {
        payNowBtn.style.visibility = "hidden";
        requestPayoutBtn.style.visibility = "hidden";
        cancelPolicyBtn.style.visibility = "hidden";
    } else {
        payNowBtn.style.visibility = "visible";
        requestPayoutBtn.style.visibility = "visible";
        cancelPolicyBtn.style.visibility = "visible";
    }

    policyDisplay.innerHTML = a;
    
    interact_right.style.display = 'block';
}

async function payNow() {
    await loadPolicyDetails();
    const installment = policyDetails["installmentAmount"]*(10**13);
    console.log("Paying " + installment);
    await window.contract.methods.payInstallment(accounts[0]).send({
        from: accounts[0],
        value: installment
    });
    await loadPolicyDetails();
}

async function requestPayout() {
    console.log("Request payout");
    await window.contract.methods.makeClaim().send({from: accounts[0]});
    await loadPolicyDetails();
}

async function cancelPolicy() {
    console.log("Cancel policy");
    await window.contract.methods.cancelPolicy().send({from: accounts[0]});
    await window.contract.methods.withdraw().send({from: accounts[0]});
    await loadPolicyDetails();
}


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
    console.log(time);
    }