import { act, useReducer, useState, useRef } from "react";
import "./styles.css";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

export default function App() {
  // const [openAmount, setOpenAmount] = useState(700);
  const openInput = useRef(null);
  // const [deposit, setDeposit] = useState(300);
  const depositInput = useRef(null);
  // const [withdrawal, setWithdrawal] = useState(300);
  const withdrawInput = useRef(null);
  // const [requestedLoan, setRequestedLoan] = useState(2000);
  const loanInput = useRef(null);

  function bankReducer(state, action) {
    switch (action.type) {
      // Opening the account with a balance of input value
      case "OPEN_ACCOUNT":
        if (!state.isActive) {
          console.log("account opened");
          return { ...state, isActive: true, balance: action.amount };
        } else {
          return state;
        }
      // Deposit of input value
      case "DEPOSIT":
        return { ...state, balance: state.balance + action.amount };
      // Withdrawal of input value
      case "WITHDRAW":
        if (state.balance >= action.amount) {
          return { ...state, balance: state.balance - action.amount };
        } else {
          console.log("Insufficient funds");
          // Update the input value to the current balance
          withdrawInput.current.value = String(state.balance);
          return state;
        }
      // Requesting a loan of input value
      case "REQUEST_LOAN":
        if (state.loan === 0) {
          return {
            ...state,
            balance: state.balance + action.amount,
            loan: state.loan + action.amount,
          };
        } else {
          return state;
        }
      // Paying the loan
      case "PAY_LOAN":
        if (state.loan !== 0) {
          return { ...state, balance: state.balance - state.loan, loan: 0 };
        } else {
          return state;
        }
      // Closing the account if there are no balance and loan
      case "CLOSE_ACCOUNT":
        if (state.balance === 0 && state.loan === 0) {
          return { ...state, isActive: false, balance: 0, loan: 0 };
        } else {
          return state;
        }
      // break; // stops here so next case isn't executed.
      default:
        throw new Error("Unknown Transaction");
    }
  }
  const [account, bankDispatch] = useReducer(bankReducer, initialState);

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {account.balance}</p>
      <p>Loan: {account.loan}</p>
      {/* Using useRef works, but we need to make sure the value is valid, so we can add a check before dispatching the action because useRef doesn't trigger a re-render */}

      {/* Opening Account */}
      <p>
        <button
          onClick={() => {
            bankDispatch({
              type: "OPEN_ACCOUNT",
              amount: Number(openInput.current.value),
            });
          }}
          disabled={account.isActive}
        >
          Open account with
        </button>
        <input
          type="number"
          ref={openInput}
          defaultValue={500}
          min={500}
          max={2000}
          step={100}
          disabled={account.isActive}
        />
      </p>
      {/* Money Deposit */}
      <p>
        <button
          onClick={() => {
            bankDispatch({
              type: "DEPOSIT",
              amount: Number(depositInput.current.value),
            });
          }}
          disabled={!account.isActive}
        >
          Deposit
        </button>
        <input
          type="number"
          ref={depositInput}
          defaultValue={500}
          min={100}
          max={5000}
          step={100}
          disabled={!account.isActive}
        />
      </p>
      {/* Money Withdrawal */}
      <p>
        <button
          onClick={() => {
            bankDispatch({
              type: "WITHDRAW",
              amount: Number(withdrawInput.current.value),
            });
          }}
          disabled={!(account.isActive && account.balance > 0)}
        >
          Withdraw
        </button>
        <input
          type="number"
          ref={withdrawInput}
          defaultValue={300}
          min={100}
          max={account.balance}
          step={100}
          disabled={!(account.isActive && account.balance > 0)}
        />
      </p>
      {/* Request Loan */}
      <p>
        <button
          onClick={() => {
            bankDispatch({
              type: "REQUEST_LOAN",
              amount: Number(loanInput.current.value),
            });
          }}
          disabled={!(account.isActive && account.loan === 0)}
        >
          Request a loan
        </button>
        <input
          type="number"
          ref={loanInput}
          defaultValue={5000}
          min={5000}
          max={50000}
          step={1000}
          disabled={!(account.isActive && account.loan === 0)}
        />
      </p>
      {/* Pay Loan */}
      <p>
        <button
          onClick={() => {
            bankDispatch({ type: "PAY_LOAN", amount: account.loan });
          }}
          disabled={
            !(
              account.loan !== 0 &&
              account.isActive &&
              account.balance >= account.loan
            )
          }
        >
          Pay your loan
        </button>
      </p>
      {/* Close Account */}
      <p>
        <button
          onClick={() => {
            bankDispatch({ type: "CLOSE_ACCOUNT" });
          }}
          disabled={
            !(account.isActive && account.balance === 0 && account.loan === 0)
          }
        >
          Close account
        </button>
      </p>
    </div>
  );
}
