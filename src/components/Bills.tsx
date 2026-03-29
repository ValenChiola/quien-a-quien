import type { Payment, User } from "../App"

export const Bills = ({
    users,
    payments,
}: {
    users: User[]
    payments: Payment[]
}) => {
    const totalBillsPerUser = users.map((user) => {
        const totalBills = payments.reduce((acc, payment) => {
            const split = payment.splits.find(
                (split) => split.userId === user.id,
            )

            if (!split) return acc

            const amount =
                payment.mode === "percentage"
                    ? // @ts-expect-error fix
                      (payment.totalAmount * split.percentage) / 100
                    : // @ts-expect-error fix
                      split.amount

            return acc + amount
        }, 0)

        return {
            ...user,
            totalBills,
        }
    })

    const totalBills = totalBillsPerUser.reduce(
        (acc, user) => acc + user.totalBills,
        0,
    )

    return (
        <main className="bills">
            <span className="bills-title">Lo que gastó cada uno</span>
            <section>
                {totalBillsPerUser.map((user) => (
                    <div key={user.id} className="bill">
                        <strong>{user.name}</strong>
                        <span>${user.totalBills.toFixed(2)}</span>
                    </div>
                ))}

                <div className="bill total">
                    <strong>Total:</strong>
                    <span>${totalBills.toFixed(2)}</span>
                </div>
            </section>
        </main>
    )
}
