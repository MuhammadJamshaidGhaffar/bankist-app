"use strict";

// ################## Global Variables ################
const containerElm = document.querySelector(".container");
const welcomeTxtElm = document.querySelector(".welcome-text");
const todayDateElm = document.querySelector(".balance-text .date");
const balanceElm = document.querySelector(".balance-value");
const historyContainer = document.querySelector(".left-div");
const errorElm = document.querySelector(".error");

const alertWrapper = document.querySelector(".alert-wrapper");
const alertTxtElm = document.querySelector(".alert-text");

const userElm = document.querySelector("#user-name");
const pinElm = document.querySelector("#pin");
const transferUserElm = document.querySelector("#transfer-user");
const transferAmountElm = document.querySelector("#transfer-amount");
const loanAmountElm = document.querySelector("#loan-amount");
const closeUserElm = document.querySelector("#close-confirm-user");
const closePinElm = document.querySelector("#close-confirm-pin");

// ---------------footer elements ----------------
const totalDepositElm = document.querySelector(".total-deposit .value");
const totalWithdrawElm = document.querySelector(".total-withdraw .value");
const sortSymbolElm = document.querySelector(".sort .symbol");
const timerElm = document.querySelector(".timer");

let accounts = [];
let userId = undefined;

let sorted = false;
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
    // ##### making random transaction #######
    for (let i = 0; i < getRndInteger(5, 20); i++) {
      let transacType = "";
      if (getRndInteger(0, 1) == 0) {
        transacType = "deposit";
      } else {
        transacType = "withdraw";
      }
      this.makeTransHist(
        new Transaction(
          transacType,
          Math.floor(getRndInteger(10, 10000) / 10) * 10
        )
      );
    }
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
      this.balance -= transac.amount;
      this.makeAndDisplayTransactionHistory(transac);
      this.displayData();
    } else if (transac.type == "deposit") {
      this.balance += transac.amount;
      this.makeTransHist(transac);
    }
  }
  makeTransHist(trans) {
    this.transacHistory.push(trans);
  }
  displayAllTransacHistory(sort) {
    historyContainer.innerHTML = "";
    sort
      ? (sortSymbolElm.innerHTML = "&UpArrow;")
      : (sortSymbolElm.innerHTML = "&DownArrow;");
    if (!sort) {
      for (let transac of this.transacHistory) {
        createTransElement(transac);
      }
    } else if (sort) {
      for (let transac of this.transacHistory) {
        if (transac.type == "withdraw") createTransElement(transac);
      }
      for (let transac of this.transacHistory) {
        if (transac.type == "deposit") createTransElement(transac);
      }
    }
  }

  makeAndDisplayTransactionHistory(transac) {
    this.makeTransHist(transac);
    if (sorted) this.displayAllTransacHistory(sorted);
    else createTransElement(transac);
  }
}

// #################### functions ####################
function createTransElement(transac) {
  console.log(transac);
  historyContainer.innerHTML =
    `<div class="history-div">
    <p class="type type-${transac.type.toLowerCase()}">${transac.type.toUpperCase()}</p>
    <p class="date">${transac.date}</p>
    <p class="amount">$${transac.amount}</p>
  </div>` + historyContainer.innerHTML;
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
function closeAlertBox() {
  alertWrapper.style.display = "none";
}
function displayAlertBox(message) {
  alertWrapper.style.display = "block";
  alertTxtElm.innerHTML = message;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
        sorted = false;
        accounts[userId].displayAllTransacHistory(sorted);
      } else {
        displayError("pin");
      }
      return;
    }
  }
  displayError("account");
}

function logout() {
  clearContainer();
  hideContainer();
  hideError();
  userId = undefined;
  displayAlertBox("You are logged out");
}

function transferCash() {
  let transferId = undefined;
  for (let i = 0; i < accounts.length; i++) {
    if (transferUserElm.value === accounts[i].user) {
      transferId = i;
      if (transferId == userId) {
        displayAlertBox("Cannot Send money to yourself");
        return;
      }
      let amount = Math.abs(Number(transferAmountElm.value));
      if (amount > accounts[userId].balance) {
        displayAlertBox("InSufficient Balance");
        return;
      }
      accounts[userId].makeTransac(new Transaction("withdraw", amount));
      accounts[transferId].makeTransac(new Transaction("deposit", amount));
      return;
    }
  }
  displayAlertBox("Account not found");
}
function requestCash() {
  displayAlertBox("This feature is not available yet");
}

function closeAccount() {
  if (closeUserElm.value == accounts[userId].user) {
    if (closePinElm.value == accounts[userId].pin) {
      accounts.splice(userId, 1);
      logout();
      displayAlertBox("Your Account has been Deleted");
    } else {
      displayAlertBox("Wrong Pin");
    }
  } else {
    displayAlertBox("Wrong User");
  }
}
function sort() {
  if (sorted) sorted = false;
  else sorted = true;
  accounts[userId].displayAllTransacHistory(sorted);
}

// ################ Event Listeners #################
{
  const alertBackg = document.querySelector(".alert-background");
  const loginBtn = document.querySelector(".login-btn");
  const transferBtn = document.querySelector("#transfer-btn");
  const requestBtn = document.querySelector("#request-btn");
  const closeBtn = document.querySelector("#close-btn");
  const sortElm = document.querySelector(".sort");

  loginBtn.addEventListener("click", login);
  transferBtn.addEventListener("click", transferCash);
  requestBtn.addEventListener("click", requestCash);
  closeBtn.addEventListener("click", closeAccount);

  alertBackg.addEventListener("click", closeAlertBox);
  sortElm.addEventListener("click", sort);
}
// ###################################################
// ################## Main Program Start #############
// ###################################################
function main() {
  clearContainer();
  // hideContainer();
  //---------- Creating Accounts -------------------------
  accounts.push(new Account("jamshaid", "123", getRndInteger(100, 10000), 0));
  accounts.push(new Account("jawad", "123", getRndInteger(100, 10000), 0));
  accounts.push(new Account("junaid", "123", getRndInteger(100, 10000), 0));
  accounts.push(new Account("hamza", "123", getRndInteger(100, 10000), 0));
  accounts.push(new Account("ali", "123", getRndInteger(100, 10000), 0));

  userElm.value = "jamshaid";
  pinElm.value = "123";
}

main();
