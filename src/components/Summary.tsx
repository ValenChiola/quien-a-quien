import { type Payment, type User } from "../App"

export const Summary = ({
    users,
    payments,
    setPayments,
}: {
    users: User[]
    payments: Payment[]
    setPayments: React.Dispatch<React.SetStateAction<Payment[]>>
}) => {
    const total = payments.reduce(
        (acc, { totalAmount }) => acc + totalAmount,
        0,
    )

    return (
        <div className="summary">
            <div className="summary-header">
                <p className="section-title" style={{ marginBottom: 0 }}>
                    Pagos
                </p>
                <span className="total">${total.toFixed(2)}</span>
            </div>
            <div className="payment-list">
                {payments.map((payment) => {
                    const payer = users.find((u) => u.id === payment.fromUserId)

                    return (
                        <div key={payment.id} className="payment">
                            <header>
                                <span className="payment-payer-name">
                                    {payer?.name}
                                </span>
                                <button
                                    onClick={() =>
                                        setPayments((old) =>
                                            old.filter(
                                                (item) =>
                                                    item.id !== payment.id,
                                            ),
                                        )
                                    }
                                >
                                    ✕
                                </button>
                            </header>
                            <p className="payment-amount-line">
                                pagó{" "}
                                <span className="payment-amount">
                                    ${payment.totalAmount.toFixed(2)}
                                </span>
                            </p>
                            <p className="payment-splits">
                                <PaidTo {...payment} users={users} />
                            </p>
                            <small>{payment.reason}</small>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const PaidTo = ({ mode, splits, users }: Payment & { users: User[] }) => {
    const getName = (userId: string) =>
        users.find((u) => u.id === userId)?.name ?? userId

    if (mode === "all") return <>Dividido entre todos</>

    if (mode === "equal") {
        const names = splits.map((s) => getName(s.userId)).join(", ")
        return (
            <>
                {names} · ${splits[0].amount.toFixed(2)} c/u
            </>
        )
    }

    if (mode === "percentage")
        return (
            <>
                {splits
                    .map((s) => `${getName(s.userId)} ${s.percentage}%`)
                    .join(", ")}
            </>
        )

    return (
        <>
            {splits
                .map((s) => `${getName(s.userId)} $${s.amount.toFixed(2)}`)
                .join(", ")}
        </>
    )
}
