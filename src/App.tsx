import { useState } from "react";
import "./App.css";
import { AddUserForm } from "./components/AddUserForm";
import { Header } from "./components/Header";
import { Summary } from "./components/Summary";
import { Debts } from "./components/Debts";

export interface User {
  name: string;
  amount: number;
}

export const MINIMUM_DEBT_AMOUNT = 0.01;

function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <main className="container">
      <Header />

      <div className="content">
        <AddUserForm
          onSubmit={(values) => {
            if (users.some((user) => user.name === values.name))
              return alert("Ya existe un usuario con ese nombre");

            setUsers((old) => old.concat(values));
          }}
        />

        <Summary users={users} />

        <Debts users={users} />
      </div>
    </main>
  );
}

export default App;
