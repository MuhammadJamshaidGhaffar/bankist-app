"use strict";

// ################## Global Variables ################
const containerElm = document.querySelector(".container");
const welcomeTxtElm = document.querySelector(".welcome-text");
const todayDateElm = document.querySelector(".balance-text .date");
const balanceElm = document.querySelector(".balance-value");
const historyContainer = document.querySelector(".left-div");
const errorElm = document.querySelector(".error");

const userElm = document.querySelector("#user-name");
const pinElm = document.querySelector("#pin");
const transferUserElm = document.querySelector("#transfer-user");
const transferAmountElm = document.querySelector("#transfer-amount");
const loanAmountElm = document.querySelector("#loan-amount");
const closeUserElm = document.querySelector("#close-confirm-user");
const closePinElm = document.querySelector("#close-confirm-pin");

let accounts = [];
let userId = -1;
// #################### CLASSES ####################
class Transaction {
  constructor(type, amount) {
    this.type = type;
    let date = new Date();
    this.date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    this.amount = amount;
  }
}

class Account {
  constructor(user, pin, balance, debt) {
    this.user = user;
    this.pin = pin;
    this.balance = balance;
    this.transacHistory = [];
    this.debt = debt;
    this.makeTransHist(new Transaction("deposit", 200));
  }

  displayData() {
    welcomeTxtElm.textContent = `Welcome ${this.user}`;
    let date = new Date();
    todayDateElm.textContent = `As of ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    balanceElm.textContent = `$${this.balance}`;
  }
  makeTransac(transac) {
    if (transac.type == "withdraw") {
      if (transac.amount <= this.balance) {
        this.balance -= transac.amount;
        this.makeAndDisplayTransactionHistory(transac);
        this.displayData();
      }
    } else if (transac.type == "deposit") {
      this.balance += transac.amount;
      this.makeTransHist(transac);
    }
  }
  makeTransHist(trans) {
    this.transacHistory.push(trans);
  }
  displayAllTransacHistory() {
    for (let transac of this.transacHistory) {
      createTransElement(transac);
    }
  }

  makeAndDisplayTransactionHistory(transac) {
    this.makeTransHist(transac);
    createTransElement(transac);
  }
}

// #################### functions ####################
function createTransElement(transac) {
  console.log(transac);
  historyContainer.innerHTML += `<div class="history-div">
    <p class="type type-${transac.type.toLowerCase()}">${transac.type.toUpperCase()}</p>
    <p class="date">${transac.date}</p>
    <p class="amount">$${transac.amount}</p>
  </div>`;
}
function displayContainer() {
  containerElm.style.display = "flex";
}
function hideContainer() {
  containerElm.style.display = "none";
}
function displayError(messageType) {
  let message = "";
  if (messageType === "account") {
    message = "Account not Found!";
  } else if (messageType === "pin") {
    message = "Incorrect Pin!";
  }

  errorElm.style.display = "block";
  errorElm.innerHTML = `<p>${message}</p>`;
}
function hideError() {
  errorElm.style.display = "none";
}
function clearContainer() {
  welcomeTxtElm.textContent = `LogIn to get started`;
  let date = new Date();
  todayDateElm.textContent = `As of ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  balanceElm.textContent = `$0`;
  historyContainer.innerHTML = "";
}
// ################# Events Functions ###################
function login() {
  clearContainer();
  hideContainer();
  hideError();
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].user === userElm.value) {
      if (accounts[i].pin === pinElm.value) {
        userId = i;
        displayContainer();
        accounts[userId].displayData();
        accounts[userId].displayAllTransacHistory();
      } else {
        displayError("pin");
      }
      return;
    }
  }
  displayError("account");
}

function transferCash() {
  let transferId = -1;
  for (let i = 0; i < accounts.length; i++) {
    if (transferUserElm.value === accounts[i].user) {
      console.log(
        `Account User :${accounts[i].user} and its current Balance is ${accounts[i].balance}`
      );
      transferId = i;
      if (transferId == userId) {
        console.log(`cannot send money to yourself`);
        return;
      }
      // ############ pending ##############
      // display an error
      if (Number(transferAmountElm.value) < 0) {
        console.log("Invalid Number");
        return;
      }
      accounts[userId].makeTransac(
        new Transaction("withdraw", Number(transferAmountElm.value))
      );
      accounts[transferId].makeTransac(
        new Transaction("deposit", Number(transferAmountElm.value))
      );
      return;
    }
  }
  console.log("Account not found");
}
function requestCash() {
  // ############ pending #############
  console.log("Cash Requested");
}

function closeAccount() {
  if (closeUserElm.value == accounts[userId].user) {
    if (closePinElm.value == accounts[userId].pin) {
      accounts.splice(userId, 1);
    }
  } else {
    console.log("wrong user");
  }
}

// ################ Event Listeners #################
{
  const loginBtn = document.querySelector(".login-btn");
  const transferBtn = document.querySelector("#transfer-btn");
  const requestBtn = document.querySelector("#request-btn");
  const closeBtn = document.querySelector("#close-btn");

  loginBtn.addEventListener("click", login);
  transferBtn.addEventListener("click", transferCash);
  requestBtn.addEventListener("click", requestCash);
  closeBtn.addEventListener("click", closeAccount);
}
// ###################################################
// ################## Main Program Start #############
// ###################################################
function main() {
  clearContainer();
  // hideContainer();
  //---------- Creating Accounts -------------------------
  accounts.push(new Account("jamshaid", "123", 2000, 0));
  accounts.push(new Account("jawad", "123", 1000, 0));
  accounts.push(new Account("junaid", "123", 500, 0));
  accounts.push(new Account("hamza", "123", 200, 0));
  accounts.push(new Account("ali", "123", 100, 0));
}

main();
console.log(accounts[1].balance + 100);
