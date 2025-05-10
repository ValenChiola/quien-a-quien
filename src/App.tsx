import React, { useEffect, useRef, useState } from "react";
import "./App.css";

interface User {
  name: string;
  amount: number;
}

const MINIMUM_DEBT_AMOUNT = 0.01;

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);

  const total = users.reduce((acc, { amount }) => acc + amount, 0);
  const average = total ? total / users.length : 0;

  const whoOwesWho = () => {
    if (users.length === 0) return ["No hay deudas"];

    const balances: Record<string, number> = {};
    users.forEach(({ name, amount }) => (balances[name] = amount - average));

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
      if (amount > MINIMUM_DEBT_AMOUNT) {
        transactions.push(
          `${debtorName} le debe a ${creditorName} $${amount.toFixed(2)}`
        );

        debtors[i][1] += amount;
        creditors[j][1] -= amount;

        if (Math.abs(debtors[i][1]) < MINIMUM_DEBT_AMOUNT) i++;

        if (creditors[j][1] < MINIMUM_DEBT_AMOUNT) j++;
      } else {
        if (-debtorBalance < creditorBalance) i++;
        else j++;
      }
    }

    return transactions.length > 0 ? transactions : ["No hay deudas"];
  };

  const onSubmitAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: HTMLFormElement = e.currentTarget;
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
    if (name.length > 33)
      return alert("El nombre no puede tener más de 33 caracteres");
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
    <main className="container">
      <header className="header">
        <h1 className="title">Quién a Quién</h1>
        <p className="subtitle">Administrador de gastos compartidos</p>
      </header>

      <div className="content">
        <form className="form" onSubmit={onSubmitAddUser}>
          <div className="input-container">
            <label className="label">
              Nombre:
              <input
                type="text"
                className="input"
                name="name"
                ref={nameRef}
                placeholder="Ej: Juan"
              />
            </label>
          </div>

          <div className="input-container">
            <label className="label">
              Cuánto dinero puso:
              <input
                type="text"
                className="input"
                name="amount"
                inputMode="decimal"
                placeholder="Ej: 150.50"
              />
            </label>
          </div>

          <button className="button">Agregar</button>
        </form>

        <div className="summary">
          <h2 className="summary-title">
            <span className="total">Total: ${total}</span>
            <span className="average">Promedio: ${average.toFixed(2)}</span>
          </h2>

          <ul className="list">
            {users.map((user) => (
              <li key={user.name} className="list-item">
                <span className="name" title={user.name}>
                  {user.name}
                </span>
                <span className="amount">${user.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="debts">
          <h2 className="debts-title">¿Quién le debe a quién?</h2>
          <ul className="debts-list">
            {whoOwesWho().map((debt, index) => (
              <li key={index} className="debt-item">
                <span className="debt" title={debt}>
                  {debt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default App;
