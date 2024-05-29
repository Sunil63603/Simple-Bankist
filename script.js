'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  //user = js
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  //user = jd
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//PROJECT JS CODE

//CHANGE 1

//to display movements (ie.deposits and withDrawals)
//receives movements array
const displayMovements = function (acc, sort = false) {
  let sortedMovs;

  sortedMovs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //empty previous values before adding new movements
  containerMovements.innerHTML = '';

  //loop over the movements array
  sortedMovs.forEach(function (movement, index) {
    const movementType = movement > 0 ? 'deposit' : 'withdrawal';

    //function has movement and 'index' bcoz we display the sl no. of the movement
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${movement}</div>
    </div>
  `;

    //now need to attach this change in the HTML document(inside movements container)

    //insertAdjacentHTML receives two parameters
    //1st one : insert HTML content at a specified position in relation to a given element.(element is containerMovements)
    //options: beforebegin, afterbegin, beforeend, afterend
    containerMovements.insertAdjacentHTML('afterbegin', html);
    //afterbegin bcoz we want to insert right at the beginning
    //even new updates will come at the beginning of containerMovements.
    //basically insert at beginning,not insert at end
  });
};

//CHANGE 2

//to add userName for login purpose

//generates userName
const createUserNames = function (accounts) {
  accounts.forEach(account => {
    //storing userId as a property in object
    account.userID = account.owner //input string
      .toLowerCase()
      .split(' ')
      .map(word => word[0]) //taking first char from every element of array
      .join('');
  });
};

//calling createUserNames on all accounts(accounts array)
createUserNames(accounts);

//CHANGE 3

// let currentBalance; //we need this while transferring and receiving money
//now using reduce() calculate balance
const calcDisplayBalance = function (acc) {
  //new property 'currentBalance' is created in this line
  acc.currentBalance = acc.movements.reduce(
    (accumulator, amount) => accumulator + amount,
    0
  );

  labelBalance.textContent = acc.currentBalance + '$';
};

//CHANGE 4

//now calculate IN,OUT,INTEREST(summary)
const calcDisplaySummary = function (acc) {
  //INCOME TOTAL
  const income = acc.movements
    .filter(movement => movement > 0)
    .reduce((totalDeposit, deposit) => {
      return totalDeposit + deposit;
    }, 0);
  labelSumIn.textContent = `${income}💲`;

  //OUTGOING TOTAL
  const outgoing = acc.movements
    .filter(movement => movement < 0)
    .reduce((totalWithdrawal, withdrawal) => {
      return totalWithdrawal + withdrawal; //convert into positive while adding
    }, 0);
  labelSumOut.textContent = `${Math.abs(outgoing)}💲`; //Math.abs() to remove the sign

  //INTEREST(interest would be given only for deposits)

  let interestPerDeposit = 0;
  const interest = acc.movements
    .filter(movement => movement > 0)
    .reduce((totalInterest, deposit) => {
      interestPerDeposit = (deposit * currentAccount.interestRate) / 100; //<1 would not be added to totalInterest.
      return totalInterest + (interestPerDeposit >= 1 ? interestPerDeposit : 0); //2nd operand is for calculating interest
    }, 0); //interest should be added only if its >=1

  labelSumInterest.textContent = `${interest.toFixed(2)}💲`;
  //toFixed(2) helps to display only 2 digits after decimal point
};

//CHANGE 5(login procedure)(EVENT HANDLERS)

let currentAccount; //we need this info for other operations(transfer money and request loan) so,keep it as a global variable.
const loginFunction = function (
  event //event parameter
) {
  event.preventDefault(); //prevent the form from reloading(submitting) the page

  //storing details entered by user
  const userName = inputLoginUsername.value;
  const userPin = inputLoginPin.value; //this is string(convert to number while comparing)

  //comparing them with all accounts.
  currentAccount = accounts.find(
    account => account.userID === userName && account.pin === Number(userPin)
  );

  //based on currentAccount display UI and welcome message
  if (currentAccount) {
    //if its undefined no need to call functions
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`; //display only firstName
    updateUI(currentAccount);
    containerApp.style.opacity = 1;
  }

  //clear the input fields after login-button is clicked.
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
};

btnLogin.addEventListener('click', loginFunction);

//this function must be called to display changes
const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

//CHANGE 6(transfers)

const transferMoney = function (event) {
  event.preventDefault(); //prevents reloading

  let receiverAccount = accounts.find(
    account => account.userID === inputTransferTo.value
  );
  let transferMoney = Number(inputTransferAmount.value); //str->number

  //one account will be returned from find()then deposit to movements of that account.

  //before transferring amount to receiver account.
  //amount must be withDrawn from sender account.(current account)

  //need to check four conditions while transferring money(amount should be positive and currentAccount balance>transferAmount and money should be transferred for diff account,not same amount and receiver account should exist)
  if (
    transferMoney > 0 &&
    currentAccount.currentBalance >= transferMoney &&
    receiverAccount?.userID !== currentAccount.userID //optional chaining to check if receiver account actually exists.
  ) {
    currentAccount.movements.push(-1 * transferMoney); //negative value is considered as withDraw
    receiverAccount.movements.push(transferMoney);
  }

  updateUI(currentAccount); //reflects dynamic changes

  //after hitting enter previous inputs must be cleared
  inputTransferTo.value = inputTransferAmount.value = '';
};

btnTransfer.addEventListener('click', transferMoney);

//CHANGE 7(request loan)
const requestLoan = function (event) {
  event.preventDefault(); //prevents form button from reloading the page
  const loanAmount = Number(inputLoanAmount.value); //str-->number

  //need to check some conditions to grant a loan
  //requested loan amount must be positive
  //currentAccount should have a deposit>10% of requested loan

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount / 10)
  )
    //some is used to check if the movements has deposit (>10%)
    currentAccount.movements.push(loanAmount); //adds loan amount to user's money

  updateUI(currentAccount);

  //clearing the fields after request
  inputLoanAmount.value = '';
};

btnLoan.addEventListener('click', requestLoan);

//CHANGE 8(close/delete account)

const closeAccount = function (event) {
  event.preventDefault(); //prevents reloading of the page

  //if these two parameters match credentials of curret users then close the account
  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);

  if (
    currentAccount.userID === confirmUser &&
    currentAccount.pin === confirmPin
  ) {
    //delete the account;
    let index = accounts.indexOf(currentAccount); //basically you can use findIndex as well....accounts.findIndex((acc)=>acc.pin === confirmPin && acc.userId === confirmUser)
    accounts.splice(index, 1); //splice 1 element at 'index'.

    currentAccount = undefined; //else every click will delete the currentAccount

    //how to update UI??'cause there is no account object anymore(hide UI)
    containerApp.style.opacity = 0;
  }

  //clear input fields after operation.
  inputCloseUsername.value = inputClosePin.value = '';
};

btnClose.addEventListener('click', closeAccount); //currentUser can close his own Account.

//CHANGE 9(sort movements)
let sorted = false; //bcoz we will be using this is displayMovements
const sortMovements = function () {
  displayMovements(currentAccount, !sorted); //only movements should be updated.
  sorted = !sorted;
};

btnSort.addEventListener('click', sortMovements);

//CHANGE 10(update Date)

//date constructor() and toLocaleDateString() method
const currentDate = new Date().toLocaleDateString('en-GB'); //en-GB for DD/MM/YYYY format

labelDate.textContent = currentDate;

//CHANGE 11(logout timer)

// Set the initial time in seconds
let timeInSeconds = 60; // 10 minutes
// timeInSeconds/60 gives minutes
// timeInSeconds%60 gives seconds

function updateTimer() {
  // Calculate minutes and seconds
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds % 60;

  // Add leading zeros if needed
  minutes = minutes < 10 ? '0' + minutes : minutes; //for single digit minute,need to add zero at left
  seconds = seconds < 10 ? '0' + seconds : seconds; //for single digit second,need to add zero at left

  // Display the time
  labelTimer.textContent = `${minutes}:${seconds}`;

  // Decrease the time by 1 second
  timeInSeconds--;

  // Check if the timer has reached zero
  if (timeInSeconds < 0) {
    clearInterval(timerInterval);
    currentAccount = 'undefined';
    containerApp.style.opacity = 0;
  }
}

// Call updateTimer every second (1000 milliseconds)
let timerInterval = setInterval(updateTimer, 1000);
