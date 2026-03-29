import { useEffect, useState } from "react"
import type { Payment, PaymentMode, User } from "../App"

export const AddPaymentForm = ({
    users,
    setPayments,
}: {
    users: User[]
    setPayments: React.Dispatch<React.SetStateAction<Payment[]>>
}) => {
    const [fromUserId, setFromUserId] = useState<User["id"] | null>(null)
    const [totalAmount, setTotalAmount] = useState(0)
    const [mode, setMode] = useState<PaymentMode>("equal")
    const [reason, setReason] = useState("")
    const [includeAll, setIncludeAll] = useState(true)
    const [participants, setParticipants] = useState<User["id"][]>([])
    const [splits, setSplits] = useState<
        {
            userId: User["id"]
            value: number
        }[]
    >([])

    useEffect(() => {
        setFromUserId(users.at(0)?.id ?? null)
        setParticipants(users.map(({ id }) => id))
        setSplits(
            users.map(({ id }) => ({
                userId: id,
                value: 0,
            })),
        )
    }, [users])

    if (!users.length) return null

    const addParticipant = (userId: User["id"]) => {
        if (participants.includes(userId)) return

        setParticipants((old) => [...old, userId])
        setSplits((old) => [...old, { userId, value: 0 }])
    }

    const removeParticipant = (userId: User["id"]) => {
        setParticipants((old) => old.filter((id) => id !== userId))
        setSplits((old) => old.filter((s) => s.userId !== userId))
        setIncludeAll(false)
    }

    const toggleAll = (checked: boolean) => {
        setIncludeAll(checked)

        if (checked) {
            setParticipants(users.map((u) => u.id))
            setSplits(
                users.map((u) => ({
                    userId: u.id,
                    value: 0,
                })),
            )
        } else {
            setParticipants([])
            setSplits([])
        }
    }

    const buildPercentagePaymentSplits = () =>
        splits.map(({ userId, value }) => ({
            userId,
            percentage: value,
        }))

    const buildEqualOrManualPaymentSplits = () =>
        splits.map(({ userId, value }) => ({
            userId,
            amount:
                mode === "equal" ? totalAmount / (splits.length || 1) : value,
        }))

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        if (!fromUserId) return alert("Seleccione quién paga")

        if (totalAmount <= 0)
            return alert("El monto total debe ser mayor a cero")

        if (!reason.trim()) return alert("Ingrese el motivo del pago")

        if (participants.length === 0)
            return alert("Agregue al menos un participante")

        if (mode === "percentage") {
            const totalPercentage = splits.reduce(
                (acc, split) => acc + split.value,
                0,
            )
            if (totalPercentage !== 100)
                return alert("El total de los porcentajes debe ser 100%")
        }

        if (mode === "manual") {
            const totalSplitAmount = splits.reduce(
                (acc, split) => acc + split.value,
                0,
            )
            if (totalSplitAmount !== totalAmount)
                return alert(
                    "El total de los montos ingresados debe ser igual al monto total",
                )
        }

        const payment: Payment = {
            id: crypto.randomUUID(),
            fromUserId,
            totalAmount,
            ...(mode === "percentage"
                ? { mode, splits: buildPercentagePaymentSplits() }
                : { mode, splits: buildEqualOrManualPaymentSplits() }),
            reason,
        }

        setPayments((old) => old.concat(payment))

        toggleAll(true)
        setTotalAmount(0)
        setMode("equal")
    }

    const availableUsers = users.filter(({ id }) => !participants.includes(id))

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <p className="section-title">Nuevo Pago</p>

            <div className="form-group">
                <label className="label">Quién paga</label>
                <select
                    className="select"
                    value={fromUserId ?? ""}
                    onChange={({ target: { value } }) => setFromUserId(value)}
                >
                    {users.map(({ id, name }) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="label">Monto total</label>
                <input
                    className="input"
                    type="number"
                    value={totalAmount}
                    onChange={({ target: { value } }) => setTotalAmount(+value)}
                />
            </div>

            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={includeAll}
                    onChange={({ target: { checked } }) => toggleAll(checked)}
                />
                Incluir a todos
            </label>

            <div className="participants-section">
                {!includeAll && (
                    <select
                        className="select"
                        onChange={({ target: { value } }) =>
                            addParticipant(value)
                        }
                    >
                        <option value="">+ Agregar participante</option>
                        {availableUsers.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                )}
                <div className="participants-tags">
                    {participants.map((id) => {
                        const user = users.find((user) => user.id === id)
                        return (
                            <span key={id} className="participant-tag">
                                {user?.name}
                                <button
                                    type="button"
                                    className="participant-remove"
                                    onClick={() => removeParticipant(id)}
                                >
                                    ✕
                                </button>
                            </span>
                        )
                    })}
                </div>
            </div>

            <div className="mode-buttons">
                <button
                    type="button"
                    className={`mode-btn${mode === "equal" ? " active" : ""}`}
                    onClick={() => setMode("equal")}
                >
                    Dividir igual
                </button>
                <button
                    type="button"
                    className={`mode-btn${mode === "percentage" ? " active" : ""}`}
                    onClick={() => setMode("percentage")}
                >
                    Por porcentaje
                </button>
                <button
                    type="button"
                    className={`mode-btn${mode === "manual" ? " active" : ""}`}
                    onClick={() => setMode("manual")}
                >
                    Manual
                </button>
            </div>

            {participants.length > 0 && (
                <div className="splits-list">
                    {splits.map((split) => {
                        const user = users.find(
                            (user) => user.id === split.userId,
                        )

                        return (
                            <div key={split.userId} className="split-item">
                                <span className="split-name">{user?.name}</span>
                                {mode === "percentage" && (
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="%"
                                        value={split.value}
                                        onChange={({ target: { value } }) =>
                                            setSplits((old) =>
                                                old.map((item) =>
                                                    item.userId === split.userId
                                                        ? {
                                                              ...item,
                                                              value: +value,
                                                          }
                                                        : item,
                                                ),
                                            )
                                        }
                                    />
                                )}
                                {mode === "manual" && (
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Monto"
                                        value={split.value}
                                        onChange={({ target: value }) =>
                                            setSplits((old) =>
                                                old.map((item) =>
                                                    item.userId === split.userId
                                                        ? {
                                                              ...item,
                                                              value: +value,
                                                          }
                                                        : item,
                                                ),
                                            )
                                        }
                                    />
                                )}
                                {mode === "equal" && (
                                    <span className="split-amount">
                                        $
                                        {(
                                            totalAmount / (splits.length || 1)
                                        ).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="form-group">
                <label className="label">Motivo</label>
                <input
                    className="input"
                    type="text"
                    value={reason}
                    onChange={({ target: { value } }) => setReason(value)}
                    placeholder="Ej: Cena, Supermercado..."
                />
            </div>

            <button type="submit" className="button">
                Crear pago
            </button>
        </form>
    )
}
