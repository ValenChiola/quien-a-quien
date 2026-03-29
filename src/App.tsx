import { useState } from "react";
import "./App.css";
import { AddUserForm } from "./components/AddUserForm";
import { Header } from "./components/Header";
import { UserList } from "./components/UserList";
import { Summary } from "./components/Summary";
import { Debts } from "./components/Debts";
import { AddPaymentForm } from "./components/AddPaymentForm";

export interface User {
  id: number;
  name: string;
  payments: Payment[];
}

export type PaymentSplit = {
  userId: number;
} & (
  | {
      amount: number;
    }
  | {
      percentage: number;
    }
);

export interface Payment {
  id: string;
  fromUserId: number;
  totalAmount: number;
  splits: PaymentSplit[];
}

export const MINIMUM_DEBT_AMOUNT = 0.01;
export const MAX_NAME_LENGTH = 33;

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  return (
    <main className="container">
      <Header />

      <div className="content">
        <div>
          <AddUserForm
            users={users}
            onSubmit={(values) => {
              if (!users.some((user) => user.id === values.id))
                setUsers((old) => old.concat(values));
            }}
          />

          <UserList users={users} setUsers={setUsers} />
        </div>
        {!!users.length && (
          <div>
            <AddPaymentForm users={users} setPayments={setPayments} />
          </div>
        )}
      </div>
      <div>
        <Summary users={users} payments={payments} />
        <Debts users={users} payments={payments} />
      </div>
    </main>
  );
}

export default App;
