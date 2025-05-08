import React, { useEffect, useRef, useState } from "react";
import "./App.css";

interface User {
  name: string;
  amount: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);

  const total = users.reduce((acc, { amount }) => acc + amount, 0);
  const average = total ? total / users.length : 0;

  const whoOwesWho = () => {
    if (users.length === 0) return ["No hay deudas"];

    const balances: Record<string, number> = {};
    users.forEach((user) => (balances[user.name] = user.amount - average));

    const debtors = Object.entries(balances)
      .filter(([, balance]) => balance < 0)
      .sort((a, b) => a[1] - b[1]);

    const creditors = Object.entries(balances)
      .filter(([, balance]) => balance > 0)
      .sort((a, b) => b[1] - a[1]);

    const transactions: string[] = [];

    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const [debtorName, debtorBalance] = debtors[i];
      const [creditorName, creditorBalance] = creditors[j];

      const amount = Math.min(-debtorBalance, creditorBalance);

      // Transacción válida
      if (amount > 0.01) {
        transactions.push(
          `${debtorName} le debe a ${creditorName} $${amount.toFixed(2)}`
        );

        debtors[i][1] += amount;
        creditors[j][1] -= amount;

        if (Math.abs(debtors[i][1]) < 0.01) i++;

        if (creditors[j][1] < 0.01) j++;
      } else {
        if (-debtorBalance < creditorBalance) i++;
        else j++;
      }
    }

    return transactions.length > 0 ? transactions : ["No hay deudas"];
  };

  const onSubmitAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameEl = form.elements.namedItem("name");
    const amountEl = form.elements.namedItem("amount");

    if (
      !(nameEl instanceof HTMLInputElement) ||
      !(amountEl instanceof HTMLInputElement)
    )
      return;

    const name = nameEl.value;
    const amount = +amountEl.value.replace(",", ".");

    if (isNaN(amount)) return alert("El monto debe ser un número");
    if (amount < 0) return alert("El monto no puede ser negativo");

    if (!name) return alert("Por favor complete el nombre del usuario");
    if (users.some((user) => user.name === name))
      return alert("Ya existe un usuario con ese nombre");

    setUsers((old) => old.concat({ name, amount }));
    form.reset();
    nameRef.current?.focus();
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <main>
      <header>
        <h1>Quién a Quién</h1>
      </header>

      <section>
        <form className="form" onSubmit={onSubmitAddUser}>
          <label>
            Nombre:
            <input type="text" name="name" ref={nameRef} />
          </label>
          <label>
            Cuánto dinero puso:
            <input type="text" name="amount" inputMode="decimal" />
          </label>
          <button>Agregar</button>
        </form>

        <h2>
          Total: ${total} - Promedio: ${average.toFixed(2)}
        </h2>
        <ul className="users">
          {users.map((user, i) => (
            <li key={i}>
              {user.name} - ${user.amount}
            </li>
          ))}
        </ul>

        <h2>¿Quién le debe a quién?</h2>
        <ul className="users">
          {whoOwesWho().map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
