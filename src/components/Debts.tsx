import { MINIMUM_DEBT_AMOUNT, type Payment, type User } from "../App";

const noDebts = ["No hay deudas"];

export const Debts = ({
  users,
  payments,
}: {
  users: User[];
  payments: Payment[];
}) => {
  const whoOwesWho = () => {
    if (users.length === 0) return noDebts;

    // 🧠 cuánto pagó cada uno
    const paidByUser: Record<number, number> = {};
    users.forEach((u) => (paidByUser[u.id] = 0));

    payments.forEach((p) => {
      paidByUser[p.fromUserId] += p.totalAmount;
    });

    // 🧠 cuánto debería pagar cada uno (según splits)
    const owedByUser: Record<number, number> = {};
    users.forEach((u) => (owedByUser[u.id] = 0));

    payments.forEach((p) => {
      p.splits.forEach((s) => {
        if ("amount" in s) {
          owedByUser[s.userId] += s.amount;
        } else if ("percentage" in s) {
          owedByUser[s.userId] += (p.totalAmount * s.percentage) / 100;
        }
      });
    });

    // 🧠 balances finales
    const balances: Record<string, number> = {};
    users.forEach((u) => {
      balances[u.name] = paidByUser[u.id] - owedByUser[u.id];
    });

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

      if (amount > MINIMUM_DEBT_AMOUNT) {
        transactions.push(
          `${debtorName} le debe a ${creditorName} $${amount.toFixed(2)}`,
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

    return transactions.length > 0 ? transactions : noDebts;
  };

  return (
    <div className="debts">
      <h2 className="debts-title">¿Quién le debe a quién?</h2>
      <ul className="debts-list">
        {whoOwesWho().map((debt, index) => (
          <li key={debt + index} className="debt-item">
            <span title={debt}>{debt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
