import { useState } from "react";
import type { User, Payment, PaymentSplit } from "../App";

export const AddPaymentForm = ({
  users,
  setPayments,
}: {
  users: User[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}) => {
  const [fromUserId, setFromUserId] = useState<number>(users[0]?.id || 0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mode, setMode] = useState<"equal" | "percentage" | "manual">("equal");
  const [includeAll, setIncludeAll] = useState(true);
  const [participants, setParticipants] = useState<number[]>(
    users.map((u) => u.id),
  );
  const [splits, setSplits] = useState(
    users.map((u) => ({
      userId: u.id,
      value: 0,
    })),
  );

  const addParticipant = (userId: number) => {
    if (participants.includes(userId)) return;

    setParticipants((prev) => [...prev, userId]);
    setSplits((prev) => [...prev, { userId, value: 0 }]);
  };

  const removeParticipant = (userId: number) => {
    setParticipants((prev) => prev.filter((id) => id !== userId));
    setSplits((prev) => prev.filter((s) => s.userId !== userId));
  };

  const toggleAll = (checked: boolean) => {
    setIncludeAll(checked);

    if (checked) {
      setParticipants(users.map((u) => u.id));
      setSplits(
        users.map((u) => ({
          userId: u.id,
          value: 0,
        })),
      );
    } else {
      setParticipants([]);
      setSplits([]);
    }
  };

  const buildPaymentSplits = (): PaymentSplit[] => {
    return splits.map((s) => {
      if (mode === "percentage") {
        return {
          userId: s.userId,
          percentage: s.value,
        } as PaymentSplit;
      }

      return {
        userId: s.userId,
        amount: mode === "equal" ? totalAmount / (splits.length || 1) : s.value,
      } as PaymentSplit;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payment: Payment = {
      id: crypto.randomUUID(),
      fromUserId,
      totalAmount,
      splits: buildPaymentSplits(),
    };

    setPayments((old) => old.concat(payment));

    toggleAll(true);
    setTotalAmount(0);
    setMode("equal");
  };

  const availableUsers = users.filter((u) => !participants.includes(u.id));

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <h2>Nuevo Pago</h2>

      <label>
        Quién paga:
        <select
          value={fromUserId}
          onChange={(e) => setFromUserId(Number(e.target.value))}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Monto total:
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(Number(e.target.value))}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={includeAll}
          onChange={(e) => toggleAll(e.target.checked)}
        />
        Todos (incluye al que paga)
      </label>

      {!includeAll && (
        <div>
          <strong>Participantes:</strong>

          <select
            onChange={(e) => {
              const userId = Number(e.target.value);
              if (userId) addParticipant(userId);
            }}
          >
            <option value="">Agregar usuario</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <div>
            {participants.map((id) => {
              const user = users.find((u) => u.id === id);
              return (
                <span key={id} style={{ marginRight: 8 }}>
                  {user?.name}
                  <button type="button" onClick={() => removeParticipant(id)}>
                    ❌
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <button type="button" onClick={() => setMode("equal")}>
          Dividir igual
        </button>
        <button type="button" onClick={() => setMode("percentage")}>
          Por porcentaje
        </button>
        <button type="button" onClick={() => setMode("manual")}>
          Manual
        </button>
      </div>

      {participants.length > 0 && (
        <div>
          {splits.map((s) => {
            const user = users.find((u) => u.id === s.userId);

            return (
              <div key={s.userId} style={{ marginTop: 8 }}>
                <strong>{user?.name}</strong>

                {mode === "percentage" && (
                  <input
                    type="number"
                    placeholder="%"
                    value={s.value}
                    onChange={(e) =>
                      setSplits((prev) =>
                        prev.map((sp) =>
                          sp.userId === s.userId
                            ? { ...sp, value: Number(e.target.value) }
                            : sp,
                        ),
                      )
                    }
                  />
                )}

                {mode === "manual" && (
                  <input
                    type="number"
                    placeholder="Monto"
                    value={s.value}
                    onChange={(e) =>
                      setSplits((prev) =>
                        prev.map((sp) =>
                          sp.userId === s.userId
                            ? { ...sp, value: Number(e.target.value) }
                            : sp,
                        ),
                      )
                    }
                  />
                )}

                {mode === "equal" && (
                  <span>{(totalAmount / (splits.length || 1)).toFixed(2)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button type="submit">Crear pago</button>
    </form>
  );
};
