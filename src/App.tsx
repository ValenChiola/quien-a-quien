import { useState } from "react";
import "./App.css";
import { AddUserForm } from "./components/AddUserForm";
import { Header } from "./components/Header";
import { Summary } from "./components/Summary";
import { Debts } from "./components/Debts";

export interface User {
  id: number;
  name: string;
  amount: number;
  paysFor: "all" | string[];
}

export const MINIMUM_DEBT_AMOUNT = 0.01;
export const MAX_NAME_LENGTH = 33;

function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <main className="container">
      <Header />

      <div className="content">
        <AddUserForm
          users={users}
          onSubmit={(values) => {
            if (users.some((user) => user.id === values.id))
              setUsers((old) =>
                old.map((user) =>
                  user.id === values.id
                    ? { ...user, amount: user.amount + values.amount }
                    : user,
                ),
              );
            else setUsers((old) => old.concat(values));
          }}
        />

        <Summary users={users} setUsers={setUsers} />

        <Debts users={users} />
      </div>
    </main>
  );
}

export default App;
